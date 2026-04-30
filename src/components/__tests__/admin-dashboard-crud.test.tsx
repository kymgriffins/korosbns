import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import Dashboard from "../admin-dashboard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    promise: vi.fn(),
  },
}));

vi.mock("motion/react", async () => {
  const ReactModule = await import("react");
  const passthrough = (tag: keyof React.JSX.IntrinsicElements) =>
    ReactModule.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"div">>(
      ({ children, ...props }, ref) => ReactModule.createElement(tag, { ...props, ref }, children),
    );

  return {
    motion: new Proxy(
      {},
      {
        get: (_, key: string) => passthrough((key as keyof React.JSX.IntrinsicElements) || "div"),
      },
    ),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe("admin dashboard CRUD", () => {
  const setupDashboard = () => {
    const modelsPayload = {
      models: [
        {
          name: "project",
          verbose_name: "Project",
          fields: [
            { name: "id", type: "integer", required: true, read_only: true },
            { name: "name", type: "char", required: true, read_only: false },
            { name: "description", type: "text", required: false, read_only: false },
          ],
        },
      ],
    };

    const records: Array<Record<string, unknown>> = [{ id: "1", name: "Alpha Project", description: "Initial" }];

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = (init?.method ?? "GET").toUpperCase();

      if (url === "/api/admin/models" && method === "GET") {
        return new Response(JSON.stringify(modelsPayload), { status: 200 });
      }

      if (url === "/api/auth/profile" && method === "GET") {
        return new Response(JSON.stringify({ email: "admin@bns.org" }), { status: 200 });
      }

      if (url === "/api/admin/seed" && method === "GET") {
        return new Response(JSON.stringify({ seeded: true, counts: { project: records.length } }), { status: 200 });
      }

      if (url === "/api/admin/seed" && method === "POST") {
        return new Response(JSON.stringify({ seeded: true, counts: { project: records.length } }), { status: 200 });
      }

      if (url.startsWith("/api/admin/models/project?limit=50") && method === "GET") {
        return new Response(JSON.stringify({ items: records }), { status: 200 });
      }

      if (url === "/api/admin/models/project" && method === "POST") {
        const body = JSON.parse(String(init?.body ?? "{}"));
        records.push({
          id: String(records.length + 1),
          name: body.name,
          description: body.description ?? "",
        });
        return new Response(JSON.stringify(records[records.length - 1]), { status: 201 });
      }

      if (url === "/api/admin/models/project/1" && method === "PATCH") {
        const body = JSON.parse(String(init?.body ?? "{}"));
        records[0] = { ...records[0], ...body };
        return new Response(JSON.stringify(records[0]), { status: 200 });
      }

      if (url === "/api/admin/models/project/1" && method === "DELETE") {
        records.splice(
          records.findIndex((row) => row.id === "1"),
          1,
        );
        return new Response(JSON.stringify({ success: true }), { status: 200 });
      }

      return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <Dashboard
        activeModel="project"
        setActiveModel={vi.fn()}
      />,
    );

    return { fetchMock };
  };

  it("supports read/create/update/delete for admin records", async () => {
    const { fetchMock } = setupDashboard();

    await screen.findByText("Alpha Project");

    fireEvent.click(screen.getByRole("button", { name: /^create$/i }));
    const createDialog = await screen.findByRole("dialog");
    fireEvent.change(within(createDialog).getAllByRole("textbox")[0], { target: { value: "Bravo Project" } });
    fireEvent.click(within(createDialog).getByRole("button", { name: /^create$/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/admin/models/project",
        expect.objectContaining({ method: "POST" }),
      ),
    );

    fireEvent.click(screen.getByLabelText("Edit 1"));
    const editDialog = await screen.findByRole("dialog");
    fireEvent.change(within(editDialog).getAllByRole("textbox")[0], { target: { value: "Alpha Updated" } });
    fireEvent.click(screen.getByRole("button", { name: /^update$/i }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/admin/models/project/1",
        expect.objectContaining({ method: "PATCH" }),
      ),
    );

    fireEvent.click(screen.getByLabelText("Delete 1"));
    fireEvent.click(screen.getAllByRole("button", { name: /^delete$/i }).at(-1)!);

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/admin/models/project/1",
        expect.objectContaining({ method: "DELETE" }),
      ),
    );
  });

  it("loads records list for the active model", async () => {
    const { fetchMock } = setupDashboard();
    await screen.findByText("Alpha Project");

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/models/project?limit=50"),
      expect.objectContaining({ cache: "no-store" }),
    );
  });
});
