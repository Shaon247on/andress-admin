// types/Permissions.type.ts

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

export interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  permissionKey?: keyof Permissions;
}