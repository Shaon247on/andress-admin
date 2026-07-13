import UsersList from "./UsersList";
import { getUsersAction } from "@/actions/user.action";

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const queryParams = {
    search: params?.search,
    status: params?.status as 'active' | 'suspended' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const res = await getUsersAction(queryParams);
  const users = res.success ? res.data.results : [];
  const total = res.success ? res.data.count : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Users Management</h1>
        <p className="text-sm text-text-muted mt-1">Manage all AthlonGo users</p>
      </div>

      <UsersList
        users={users}
        total={total}
        errorMessage={!res.success ? res.message : undefined}
      />
    </div>
  );
}