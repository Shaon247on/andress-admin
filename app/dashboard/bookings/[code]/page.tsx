import { notFound } from "next/navigation";
import BookingDetails from "./BookingDetails";
import { getBookingDetailsAction } from "@/actions/booking.action";

export default async function BookingDetailsPage({
  params,
}: {
  params?: Promise<{ code: string }>;
}) {
  const { code } = (await params) || { code: "" };

  if (!code) {
    notFound();
  }

  const res = await getBookingDetailsAction(code);
  console.log("the bookings:", res);
  if (!res.success || !res.data) {
    notFound();
  }

  return <BookingDetails booking={res.data} />;
}
