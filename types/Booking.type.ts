// types/Booking.type.ts

export interface BookingStats {
  success: boolean;
  total: number;
  confirmed: number;
  cancelled: number;
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

export interface BookingResult {
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
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
}

export interface BookingsListResponse {
  success: boolean;
  count: number;
  page: number;
  page_size: number;
  results: BookingResult[];
}

export interface BookingsQuery {
  search?: string;
  status?: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  page?: number;
}

// ── Booking Details Types ──

export interface BookingPlayer {
  slot: number;
  open: boolean;
  name?: string;
  position?: string;
  ovr?: number;
  is_paid?: boolean;
  is_captain?: boolean;
}

export interface BookingTeam {
  name: string;
  filled: number;
  capacity: number;
  paid: number;
  unpaid: number;
  players: BookingPlayer[];
}

export interface BookingScore {
  team_a: number;
  team_b: number;
}

export interface BookingDetail {
  id: string;
  code: string;
  source: string;
  title: string;
  match_type: string;
  visibility: string;
  game_format: string;
  price: string;
  date: string;
  start_time: string;
  time: string;
  court: string;
  payment_completed: boolean;
  score: BookingScore;
  team_a: BookingTeam;
  team_b: BookingTeam;
}

export interface BookingDetailResponse {
  success: boolean;
  booking: BookingDetail;
}