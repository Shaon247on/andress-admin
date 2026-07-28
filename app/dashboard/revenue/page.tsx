import RevenuePage from "./RevenueList";
import { getRevenueStatsAction, getRevenueHistoryAction } from "@/actions/revenue.action";

export default async function RevenuePageWrapper({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = (await searchParams) || {};

  const queryParams = {
    search: params?.search,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [statsRes, historyRes] = await Promise.all([
    getRevenueStatsAction(),
    getRevenueHistoryAction(queryParams),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Revenue Management
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your earnings and withdrawals
        </p>
      </div>

      <RevenuePage
        initialStats={statsRes.success ? statsRes.data : null}
        initialHistory={historyRes.success ? historyRes.data.results : []}
        initialPagination={historyRes.success ? historyRes.data.pagination : null}
        statsError={!statsRes.success ? statsRes.message : undefined}
        historyError={!historyRes.success ? historyRes.message : undefined}
      />
    </div>
  );
}