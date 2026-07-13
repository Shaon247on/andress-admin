
import { getUserDetailAction } from "@/actions/user.action";
import UserDetails from "./UserDetails";

export default async function UserDetailsPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = await params || { id: '' };
  
  const res = await getUserDetailAction(id);
  const user = res.success ? res.data : null;

  return (
    <UserDetails
      user={user}
      errorMessage={!res.success ? res.message : undefined}
    />
  );
}