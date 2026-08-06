import AdminUserList from "./AdminUserList";
import { getAdminUsersAction } from "@/actions/admin-user.action";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
   const params = (await searchParams) || {};
  
  const queryParams = {
    search: params?.search,
    role: params?.role as "admin" | "staff" | undefined,
    status: params?.status as "active" | "inactive" | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const res = await getAdminUsersAction(queryParams);
  const users = res.success ? res.data.results : [];
  const total = res.success ? res.data.count : 0;

  return (
    <div className="space-y-6 pb-10">
      <AdminUserList
        users={users}
        total={total}
        errorMessage={!res.success ? res.message : undefined}
      />
    </div>
  );
}