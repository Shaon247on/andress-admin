import AdminUserList from "./AdminUserList";
import { getAdminUsersAction } from "@/actions/admin-user.action";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams?: Record<string, string | undefined>;
}) {
  const params = {
    search: searchParams?.search,
    page: searchParams?.page,
    role: searchParams?.role,
    status: searchParams?.status,
  };

  const res = await getAdminUsersAction(params);
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