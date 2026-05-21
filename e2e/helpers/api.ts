import { execSync } from "node:child_process";
import path from "node:path";

import type { PersonasFile } from "./personas";

export async function apiGet<T>(personas: PersonasFile, apiPath: string): Promise<T> {
  const url = `${personas.apiBase}/api/v1${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`GET ${url} failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function apiPost<T>(
  personas: PersonasFile,
  apiPath: string,
  body: unknown,
  token?: string,
): Promise<{ status: number; data: T }> {
  const url = `${personas.apiBase}/api/v1${apiPath.startsWith("/") ? apiPath : `/${apiPath}`}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    credentials: apiPath.includes("/surveys/") && apiPath.endsWith("/submit/") ? "include" : "same-origin",
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { status: res.status, data };
}

/** Fetch verification token from Django (local E2E only). */
export function fetchVerificationToken(email: string, personas: PersonasFile): string {
  const backendDir = path.resolve(__dirname, "../../../bnske.budgetndiostory.org");
  const cmd = `python manage.py e2e_verification_token --email ${email}`;
  try {
    return execSync(cmd, {
      cwd: backendDir,
      encoding: "utf8",
      env: { ...process.env, E2E_API_BASE_URL: personas.apiBase },
    }).trim();
  } catch (err) {
    throw new Error(
      `Could not read verification token for ${email}. Is Django running and user registered? ${String(err)}`,
    );
  }
}

export async function login(personas: PersonasFile, email: string, password: string): Promise<string> {
  const { status, data } = await apiPost<{ access: string }>(personas, "/auth/login/", {
    email,
    password,
  });
  if (status !== 200 || !data.access) {
    throw new Error(`Login failed for ${email}: ${status}`);
  }
  return data.access;
}
