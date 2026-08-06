// app/dashboard/support/[id]/page.tsx

import { notFound } from "next/navigation";
import AdminChatPage from "./AdminChatPage";
import { getAdminTicketDetailsAction } from "@/actions/admin-support.action";

interface AdminChatPageProps {
  params: Promise<Record<string, string | undefined>>;
}

export default async function AdminChatPageWrapper({ params }: AdminChatPageProps) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const res = await getAdminTicketDetailsAction(id);
  
  if (!res.success || !res.data) {
    notFound();
  }

  return <AdminChatPage ticket={res.data.ticket} thread={res.data.thread} />;
}