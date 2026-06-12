export interface Permissions {
  can_users: boolean;
  can_courts: boolean;
  can_bookings: boolean;
  can_payments: boolean;
  can_settings: boolean;
  can_support: boolean;
  can_reports: boolean;
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

export interface CreateAdminUserPayload {
  full_name: string;
  email: string;
  role: AdminUserRole;
  permissions: Permissions;
}

export interface EditAdminUserPayload {
  full_name: string;
  role: AdminUserRole;
  permissions: Permissions;
}

export interface AdminUsersQuery {
  search?: string;
  page?: string;
  role?: string;
  status?: string;
}