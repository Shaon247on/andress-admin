export interface Permissions {
  dashboard: boolean;
  requests: boolean;
  athlongo_users: boolean;
  admin_users: boolean;
  court_manager: boolean;
  all_courts: boolean;
  bookings: boolean;
  support: boolean;
  payments: boolean;
}

export interface AdminUserResult {
  id: string;
  full_name: string;
  email: string;
  role: string;
  role_display: string;
  status: string;
  last_login: string | null;
  permissions: Permissions;
}

export interface AdminUsersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminUserResult[];
}

export type AdminUserRole = "super_admin" | "moderator" | "support";
export type AdminUserStatus = "active" | "inactive";

export interface CreateAdminUserPayload {
  full_name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  permissions: Permissions;
}

export interface EditAdminUserPayload {
  full_name: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  permissions: Permissions;
}

export interface AdminUsersQuery {
  search?: string;
  page?: string;
  role?: string;
  status?: string;
}