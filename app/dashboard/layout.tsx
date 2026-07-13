import DashboardShell from "@/components/dashboard/DashboardShell";
import { UserProvider } from "@/context/UserContext";
import { getPermissions } from "@/lib/cookies";
import React from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const permissions = await getPermissions();
  return (
    <UserProvider>
      <DashboardShell permissions={permissions}>{children}</DashboardShell>
    </UserProvider>
  );
}
