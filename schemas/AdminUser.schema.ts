import { z } from "zod";

export const permissionsSchema = z.object({
  can_users: z.boolean().default(false),
  can_courts: z.boolean().default(false),
  can_bookings: z.boolean().default(false),
  can_payments: z.boolean().default(false),
  can_settings: z.boolean().default(false),
  can_support: z.boolean().default(false),
  can_reports: z.boolean().default(false),
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
  permissions: permissionsSchema,
});

export const editAdminUserSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  role: z.enum(["super_admin", "moderator", "support"], {
    required_error: "Role is required",
  }),
  permissions: permissionsSchema,
});