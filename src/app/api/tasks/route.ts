import { NextResponse } from "next/server";
import { ORG_SEED, type OrgTask } from "@/lib/org";
import { cookies } from "next/headers";

type IncomingTask = Partial<OrgTask> & {
  assignee?: string;
  dueDate?: string;
};

const normalizeStatus = (value?: string): OrgTask["status"] => {
  const normalized = (value ?? "").toLowerCase();
  if (normalized === "done" || normalized === "completed") return "done";
  if (normalized === "in_progress" || normalized === "in progress") return "in_progress";
  if (normalized === "blocked") return "blocked";
  return "todo";
};

const normalizePriority = (value?: string): OrgTask["priority"] => {
  const normalized = (value ?? "").toLowerCase();
  if (normalized === "high") return "high";
  if (normalized === "low") return "low";
  return "medium";
};

const normalizeTasks = (items: IncomingTask[]): OrgTask[] =>
  items.map((task, index) => {
    const assigneeName =
      (task as IncomingTask & { assigned_to_name?: string }).assigned_to_name ??
      (task as IncomingTask & { created_by_name?: string }).created_by_name;

    return {
      id: task.id ?? `remote-task-${index + 1}`,
      title: task.title ?? "Untitled task",
      owner: task.owner ?? task.assignee ?? assigneeName ?? "Unassigned",
      due: task.due ?? task.dueDate ?? (task as IncomingTask & { due_date?: string }).due_date ?? "",
      status: normalizeStatus(task.status),
      priority: normalizePriority(task.priority),
      notes: task.notes ?? (task as IncomingTask & { description?: string }).description,
    };
  });

const buildHeaders = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("bns_admin_session")?.value;
  const token = sessionToken ?? process.env.TASKS_API_TOKEN ?? process.env.DJANGO_API_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

import { API_BASE_URL } from "@/lib/api-config";

const DEFAULT_REFRESH_ENDPOINT = `${API_BASE_URL}/api/auth/refresh/`;

const tryRefreshAccessToken = async () => {
  const cookieStore = await cookies();
  const refresh = cookieStore.get("bns_admin_refresh")?.value;
  if (!refresh) return null;

  const endpoint = process.env.DJANGO_AUTH_REFRESH_URL ?? DEFAULT_REFRESH_ENDPOINT;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const payload = await response.json().catch(() => ({}));
  return payload?.access as string | undefined;
};

export async function GET() {
  const endpoint = process.env.TASKS_API_URL ?? process.env.NEXT_PUBLIC_TASKS_ENDPOINT;

  if (!endpoint) {
    return NextResponse.json(
      {
        source: "seed",
        tasks: ORG_SEED.meetings.flatMap((meeting) => meeting.actionItems),
      },
      { status: 200 }
    );
  }

  try {
    let response = await fetch(endpoint, {
      method: "GET",
      headers: await buildHeaders(),
      cache: "no-store",
    });

    let refreshedAccess: string | null = null;
    if (response.status === 401) {
      refreshedAccess = (await tryRefreshAccessToken()) ?? null;
      if (refreshedAccess) {
        response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshedAccess}`,
          },
          cache: "no-store",
        });
      }
    }

    if (!response.ok) {
      throw new Error(`Remote tasks API failed with ${response.status}`);
    }

    const payload = await response.json();
    const candidates = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.tasks)
      ? payload.tasks
      : Array.isArray(payload?.data)
      ? payload.data
      : [];

    const normalized = normalizeTasks(candidates as IncomingTask[]);

    const out = NextResponse.json(
      {
        source: "endpoint",
        tasks: normalized,
      },
      { status: 200 }
    );
    if (refreshedAccess) {
      out.cookies.set("bns_admin_session", refreshedAccess, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });
    }
    return out;
  } catch {
    return NextResponse.json(
      {
        source: "seed",
        tasks: ORG_SEED.meetings.flatMap((meeting) => meeting.actionItems),
      },
      { status: 200 }
    );
  }
}

export async function PATCH(request: Request) {
  const updateEndpoint = process.env.TASKS_API_UPDATE_URL;

  if (!updateEndpoint) {
    return NextResponse.json(
      {
        message:
          "TASKS_API_UPDATE_URL is not configured. Set it to enable status updates in production.",
      },
      { status: 501 }
    );
  }

  try {
    const payload = await request.json();
    const id = payload?.id as string | undefined;
    const status = payload?.status as string | undefined;

    if (!id || !status) {
      return NextResponse.json({ message: "Both id and status are required." }, { status: 400 });
    }

    const resolvedEndpoint = updateEndpoint.includes("{id}")
      ? updateEndpoint.replace("{id}", id)
      : updateEndpoint;

    let response = await fetch(resolvedEndpoint, {
      method: "PATCH",
      headers: await buildHeaders(),
      body: JSON.stringify({ status }),
      cache: "no-store",
    });

    let refreshedAccess: string | null = null;
    if (response.status === 401) {
      refreshedAccess = (await tryRefreshAccessToken()) ?? null;
      if (refreshedAccess) {
        response = await fetch(resolvedEndpoint, {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshedAccess}`,
          },
          body: JSON.stringify({ status }),
          cache: "no-store",
        });
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message ?? `Update failed with ${response.status}` },
        { status: response.status }
      );
    }

    const out = NextResponse.json({ message: "Task updated", data }, { status: 200 });
    if (refreshedAccess) {
      out.cookies.set("bns_admin_session", refreshedAccess, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
      });
    }
    return out;
  } catch {
    return NextResponse.json({ message: "Failed to update task." }, { status: 500 });
  }
}
