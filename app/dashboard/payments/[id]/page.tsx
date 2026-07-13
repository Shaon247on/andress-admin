import { notFound } from "next/navigation";
import PaymentDetails from "./PaymentDetails";
import { getPaymentDetailsAction } from "@/actions/payment.action";

export default async function PaymentDetailsPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = await params || { id: '' };
  
  if (!id) {
    notFound();
  }

  const res = await getPaymentDetailsAction(id);
  
  if (!res.success || !res.data) {
    notFound();
  }

  return <PaymentDetails payment={res.data.payment} />;
}