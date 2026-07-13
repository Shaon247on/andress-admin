import PaymentsList from "./PaymentsList";
import {
  getPaymentsAction,
  getPaymentStatsAction,
} from "@/actions/payment.action";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = (await searchParams) || {};

  const queryParams = {
    search: params?.search,
    status: params?.status as "pending" | "paid" | "rejected" | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [paymentsRes, statsRes] = await Promise.all([
    getPaymentsAction(queryParams),
    getPaymentStatsAction(),
  ]);

  const payments = paymentsRes.success ? paymentsRes.data.results : [];
  const pagination = paymentsRes.success ? paymentsRes.data.pagination : null;
  const stats = statsRes.success ? statsRes.data : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          Payment Management
        </h1>
        <p className="text-sm text-text-muted mt-1">
          Monitor transactions and revenue
        </p>
      </div>

      <PaymentsList
        payments={payments}
        pagination={pagination}
        stats={stats}
        errorMessage={!paymentsRes.success ? paymentsRes.message : undefined}
        statsError={!statsRes.success ? statsRes.message : undefined}
      />
    </div>
  );
}
