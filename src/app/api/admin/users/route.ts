import { NextRequest, NextResponse } from "next/server";

import { addUser, getUsers, genId } from "@/data/admin-users-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase();
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const pageSize = 25;

  let filtered = getUsers();
  if (search) {
    filtered = getUsers().filter(
      (u) =>
        u.email.toLowerCase().includes(search) ||
        u.first_name.toLowerCase().includes(search) ||
        u.last_name.toLowerCase().includes(search),
    );
  }

  const start = (page - 1) * pageSize;
  const results = filtered.slice(start, start + pageSize);

  return NextResponse.json({ count: filtered.length, results });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const now = new Date().toISOString();
  const user = {
    id: genId(),
    email: body.email ?? "",
    first_name: body.first_name ?? "",
    last_name: body.last_name ?? "",
    display_name: body.display_name,
    avatar: body.avatar ?? null,
    role: body.role ?? "viewer",
    is_active: body.is_active ?? true,
    date_joined: now,
    last_login: null,
  };
  addUser(user);
  return NextResponse.json(user, { status: 201 });
}
