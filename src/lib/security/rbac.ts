export type Role = "CREATOR" | "VIEWER" | "ADMIN";

export type Permission =
  | "creator:read"
  | "creator:update"
  | "creator:payments:read"
  | "creator:overlay:update"
  | "viewer:read"
  | "viewer:update"
  | "payment:create"
  | "refund:create"
  | "admin:read"
  | "admin:write"
  | "payout:manage";

const permissionsByRole: Record<Role, Permission[]> = {
  CREATOR: [
    "creator:read",
    "creator:update",
    "creator:payments:read",
    "creator:overlay:update",
    "payment:create",
    "refund:create"
  ],
  VIEWER: ["viewer:read", "viewer:update", "payment:create", "refund:create"],
  ADMIN: [
    "creator:read",
    "creator:update",
    "creator:payments:read",
    "creator:overlay:update",
    "viewer:read",
    "viewer:update",
    "payment:create",
    "refund:create",
    "admin:read",
    "admin:write",
    "payout:manage"
  ]
};

export function can(role: Role, permission: Permission) {
  return permissionsByRole[role].includes(permission);
}

export function assertPermission(role: Role, permission: Permission) {
  if (!can(role, permission)) {
    throw new Error(`Missing permission: ${permission}`);
  }
}
