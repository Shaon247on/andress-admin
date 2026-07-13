import CourtsList from "./CourtsLista";
import { getCourtsAction, getCourtStatsAction } from "@/actions/court.action";

export default async function CourtsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const queryParams = {
    search: params?.search,
    status: params?.status as 'active' | 'under_maintenance' | 'closed' | undefined,
    court_type: params?.court_type as 'indoor' | 'outdoor' | 'both' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [courtsRes, statsRes] = await Promise.all([
    getCourtsAction(queryParams),
    getCourtStatsAction(),
  ]);

  const courts = courtsRes.success ? courtsRes.data.results : [];
  const total = courtsRes.success ? courtsRes.data.count : 0;
  const stats = statsRes.success ? statsRes.data : null;


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">All Courts</h1>
        <p className="text-sm text-text-muted mt-1">View and manage all courts across the platform</p>
      </div>

      <CourtsList
        courts={courts}
        total={total}
        stats={stats}
        errorMessage={!courtsRes.success ? courtsRes.message : undefined}
        statsError={!statsRes.success ? statsRes.message : undefined}
      />
    </div>
  );
}