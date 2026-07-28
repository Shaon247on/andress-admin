// types/Dashboard.type.ts

export interface DashboardCards {
  total_users: number;
  pending_requests: number;
  court_managers: number;
  total_courts: number;
  pending_payments?: number;
  active_staff?: number;
  active_bookings: number;
  support_messages: number;
}

export interface BookingTrendItem {
  day: string;
  date: string;
  count: number;
}

export interface TopManager {
  manager_id: string;
  manager: string;
  revenue: string;
  bookings: number;
}

export interface BookingCustomer {
  name: string;
  email: string;
}

export interface BookingCourt {
  name: string;
  facility: string;
  sport: string;
  club_name?: string;
}

export interface TodayBooking {
  id: string;
  code: string;
  booking_type: string;
  customer: BookingCustomer;
  court: BookingCourt;
  location: string;
  date: string;
  time: string;
  start_time: string;
  duration: number;
  price: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
}

export interface DashboardData {
  success: boolean;
  cards: DashboardCards;
  booking_trend: BookingTrendItem[];
  top_managers_by_revenue: TopManager[];
  todays_bookings: TodayBooking[];
}