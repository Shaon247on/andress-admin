import BookingsList from "./BookingsList";
import { getBookingsAction, getBookingStatsAction } from "@/actions/booking.action";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const queryParams = {
    search: params?.search,
    status: params?.status as 'confirmed' | 'cancelled' | 'completed' | 'pending' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [bookingsRes, statsRes] = await Promise.all([
    getBookingsAction(queryParams),
    getBookingStatsAction(),
  ]);

  const bookings = bookingsRes.success ? bookingsRes.data.results : [];
  const total = bookingsRes.success ? bookingsRes.data.count : 0;
  const pageSize = bookingsRes.success ? (bookingsRes.data.page_size || 20) : 20;
  const stats = statsRes.success ? statsRes.data : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">Bookings</h1>
        <p className="text-sm text-text-muted mt-1">View and manage all court bookings</p>
      </div>

      <BookingsList
        bookings={bookings}
        total={total}
        pageSize={pageSize}
        stats={stats}
        errorMessage={!bookingsRes.success ? bookingsRes.message : undefined}
        statsError={!statsRes.success ? statsRes.message : undefined}
      />
    </div>
  );
}