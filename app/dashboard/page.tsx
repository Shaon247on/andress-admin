import DashboardOverview from "./DashboardOverview";
import { getDashboardAction } from "@/actions/dashboard.action";

export default async function DashboardPage() {
  const res = await getDashboardAction();
  const data = res.success ? res.data : null;
  const errorMessage = !res.success ? res.message : undefined;

  return (
    <DashboardOverview data={data} errorMessage={errorMessage} />
  );
}