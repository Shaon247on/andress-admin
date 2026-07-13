import { z } from "zod";

export const permissionsSchema = z.object({
  dashboard: z.boolean().default(false),
  requests: z.boolean().default(false),
  athlongo_users: z.boolean().default(false),
  admin_users: z.boolean().default(false),
  court_manager: z.boolean().default(false),
  all_courts: z.boolean().default(false),
  bookings: z.boolean().default(false),
  support: z.boolean().default(false),
  payments: z.boolean().default(false),
});

export const adminUsersQuerySchema = z.object({
  search: z.string().optional(),
  page: z.string().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
});

export const createAdminUserSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["super_admin", "moderator", "support"], {
    required_error: "Role is required",
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
  permissions: permissionsSchema,
});

export const editAdminUserSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  role: z.enum(["super_admin", "moderator", "support"], {
    required_error: "Role is required",
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "Status is required",
  }),
  permissions: permissionsSchema,
});