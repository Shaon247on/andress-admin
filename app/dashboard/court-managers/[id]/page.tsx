import CourtManagerDetails from "./CourtManagerDetails";
import { getCourtManagerDetailAction } from "@/actions/court-manager.action";

export default async function CourtManagerDetailsPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = await params || { id: '' };
  
  const res = await getCourtManagerDetailAction(id);
  const manager = res.success ? res.data.manager : null;

  return (
    <CourtManagerDetails
      manager={manager}
      errorMessage={!res.success ? res.message : undefined}
    />
  );
}