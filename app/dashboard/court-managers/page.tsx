import CourtManagersList from "./CourtManagersList";
import { getCourtManagersAction, getCourtManagerStatsAction } from "@/actions/court-manager.action";

export default async function CourtManagersPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const queryParams = {
    search: params?.search,
    status: params?.status as 'active' | 'inactive' | undefined,
    ordering: params?.ordering as '-revenue' | '-courts_count' | 'first_name' | '-date_joined' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [managersRes, statsRes] = await Promise.all([
    getCourtManagersAction(queryParams),
    getCourtManagerStatsAction(),
  ]);

  const managers = managersRes.success ? managersRes.data.results : [];
  const total = managersRes.success ? managersRes.data.count : 0;
  const stats = statsRes.success ? statsRes.data : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Court Managers</h1>
        <p className="text-sm text-text-muted mt-1">Manage all court managers on the platform</p>
      </div>

      <CourtManagersList
        managers={managers}
        total={total}
        stats={stats}
        errorMessage={!managersRes.success ? managersRes.message : undefined}
        statsError={!statsRes.success ? statsRes.message : undefined}
      />
    </div>
  );
}