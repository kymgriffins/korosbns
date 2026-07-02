import { NextRequest, NextResponse } from "next/server";

import { updateUser, deleteUser } from "@/data/admin-users-store";

function getId(request: NextRequest): string {
  const path = request.nextUrl.pathname;
  const match = path.match(/\/users\/([^/]+)/);
  return match ? match[1] : "";
}

export async function PATCH(request: NextRequest) {
  const id = getId(request);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const body = await request.json();
  const updated = updateUser(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const id = getId(request);
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const deleted = deleteUser(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return new NextResponse(null, { status: 204 });
}
