import RequestsList from "./RequestsList";
import { getRequestsAction, getRequestStatsAction } from "@/actions/request.action";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const queryParams = {
    search: params?.search,
    status: params?.status as 'pending' | 'approved' | 'rejected' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [requestsRes, statsRes] = await Promise.all([
    getRequestsAction(queryParams),
    getRequestStatsAction(),
  ]);

  const requests = requestsRes.success ? requestsRes.data.results : [];
  const total = requestsRes.success ? requestsRes.data.count : 0;
  const stats = statsRes.success ? statsRes.data : null;

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Requests</h1>
        <p className="text-sm text-text-muted mt-1">Review and manage court manager applications</p>
      </div>

      <RequestsList
        requests={requests}
        total={total}
        stats={stats}
        errorMessage={!requestsRes.success ? requestsRes.message : undefined}
        statsError={!statsRes.success ? statsRes.message : undefined}
      />
    </div>
  );
}