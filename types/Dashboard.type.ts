// types/Dashboard.type.ts

export interface DashboardCards {
  total_users: number;
  pending_requests: number;
  court_managers: number;
  total_courts: number;
  active_bookings: number;
  support_messages: number;
}

export interface BookingTrendItem {
  day: string;
  date: string;
  count: number;
}

export interface CourtUtilizationItem {
  court: string;
  utilization: number;
}

export interface BookingCustomer {
  name: string;
  email: string;
}

export interface BookingCourt {
  name: string;
  facility: string;
  sport: string;
}

export interface TodayBooking {
  id: string;
  code: string;
  customer: BookingCustomer;
  court: BookingCourt;
  location: string;
  date: string;
  time: string;
  start_time: string;
  duration: number;
  price: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

export interface DashboardData {
  success: boolean;
  cards: DashboardCards;
  booking_trend: BookingTrendItem[];
  court_utilization: CourtUtilizationItem[];
  todays_bookings: TodayBooking[];
}