export interface AdminUserRecord {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name?: string;
  avatar?: string | null;
  role: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string | null;
}

let _users: AdminUserRecord[] = [];
let _nextId = 1;

export function genId() {
  return `u-${_nextId++}`;
}

export function getUsers(): AdminUserRecord[] {
  return _users;
}

export function setUsers(users: AdminUserRecord[]) {
  _users = users;
}

export function addUser(user: AdminUserRecord) {
  _users.unshift(user);
}

export function updateUser(id: string, data: Partial<AdminUserRecord>): AdminUserRecord | null {
  const idx = _users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  _users[idx] = { ..._users[idx], ...data, id };
  return _users[idx];
}

export function deleteUser(id: string): boolean {
  const idx = _users.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  _users.splice(idx, 1);
  return true;
}
