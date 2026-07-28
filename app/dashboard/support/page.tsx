// app/dashboard/support/page.tsx

import AdminSupportClient from "./components/AdminSupportClient";
import { getAdminSupportTicketsAction, getAdminSupportStatsAction } from "@/actions/admin-support.action";

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const audience = (params?.audience as 'users' | 'managers') || 'users';
  
  const queryParams = {
    audience,
    search: params?.search,
    status: params?.status as 'open' | 'in_progress' | 'resolved' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [ticketsRes, statsRes] = await Promise.all([
    getAdminSupportTicketsAction(queryParams),
    getAdminSupportStatsAction(audience),
  ]);

  const tickets = ticketsRes.success ? ticketsRes.data.results : [];
  const pagination = ticketsRes.success ? ticketsRes.data.pagination : null;
  const stats = statsRes.success ? statsRes.data : null;

  return (
    <div className="space-y-6 relative">
      

      <AdminSupportClient
        initialTickets={tickets}
        pagination={pagination}
        stats={stats}
        audience={audience}
        errorMessage={!ticketsRes.success ? ticketsRes.message : undefined}
        statsError={!statsRes.success ? statsRes.message : undefined}
      />
    </div>
  );
}