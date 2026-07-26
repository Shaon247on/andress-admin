// types/CourtManager.type.ts

export interface CourtManagerStats {
  success: boolean;
  total_managers: number;
  active_managers: number;
  total_courts: number;
  total_revenue: number;
}

export interface CourtManagerResult {
  id: string;
  full_name: string;
  email: string;
  venue: string;
  location: string;
  courts: number;
  bookings: number;
  revenue: string;
  status: "active" | "inactive";
  photo_url: string;
}

export interface CourtManagersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CourtManagerResult[];
}

export interface CourtManagersQuery {
  search?: string;
  status?: "active" | "inactive";
  ordering?: "-revenue" | "-courts_count" | "first_name" | "-date_joined";
  page?: number;
}

// ── Details Types ──

export interface Court {
  id: string;
  name: string;
  court_type: string;
  game_format: string;
  status: string;
  price_per_hour: string;
  location: string;
}

export interface RecentBooking {
  id: string;
  source: string;
  date: string;
  start_time: string;
  end_time: string;
  court: string;
  players: string[];
  player_count: number;
  amount: string;
  payment_type: string;
  kind: string;
  status: string;
}

export interface ManagerInfo {
  email: string;
  phone: string;
  location: string;
  joined: string;
}

export interface AccountStatus {
  status: string;
  last_active: string | null;
  member_since: string;
}

export interface Performance {
  bookings: number;
  revenue: number;
  rating: {
    average: number;
    count: number;
  };
}

export interface Commission {
  percentage: number;
  is_set: boolean;
}

export interface Overview {
  manager_info: ManagerInfo;
  account_status: AccountStatus;
  performance: Performance;
  commission: Commission;
  recent_bookings: RecentBooking[];
}

export interface Cards {
  total_bookings: number;
  revenue: string;
  number_of_courts: number;
  total_posts: number;
}

export interface CourtManagerDetail {
  id: string;
  full_name: string;
  email: string;
  venue: string;
  location: string;
  courts: number;
  bookings: number;
  revenue: string;
  status: "active" | "inactive";
  phone_number: string;
  photo_url: string;
  date_joined: string;
  courts_list: Court[];
  overview: Overview;
  cards: Cards;
}

export interface CourtManagerDetailResponse {
  success: boolean;
  manager: CourtManagerDetail;
}

// ── Courts Tab Types ──

export interface CourtsCard {
  total: number;
  available: number;
  maintenance: number;
}

export interface CourtItem {
  id: string;
  name: string;
  location: string;
  sport: string;
  surface: string;
  court_type: string;
  game_format: string;
  status: string;
  price_per_hour: string;
  bookings: number;
  revenue: string;
}

export interface PaginationInfo {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CourtsTabResponse {
  success: boolean;
  cards: CourtsCard;
  courts: CourtItem[];
  pagination: PaginationInfo;
}

// ── Bookings Tab Types ──

export interface BookingsCard {
  total_bookings: number;
  available_slots: number;
  utilization: number;
}

export interface BookingItem {
  id: string;
  source: string;
  date: string;
  start_time: string;
  end_time: string;
  court: string;
  players: string[];
  player_count: number;
  amount: string;
  payment_type: string;
  kind: string;
  status: string;
}

export interface BookingsTabResponse {
  success: boolean;
  cards: BookingsCard;
  bookings: BookingItem[];
  pagination: PaginationInfo;
}

// ── Customers Tab Types ──

export interface CustomerItem {
  id: string;
  full_name: string;
  country: string;
  phone: string;
  email: string;
  total_games: number;
  benefits: number;
}

export interface CustomersTabResponse {
  success: boolean;
  customers: CustomerItem[];
  pagination: PaginationInfo;
}

// ── Team Tab Types ──

export interface TeamCard {
  total: number;
  active: number;
}

export interface StaffItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  is_active: boolean;
}

export interface TeamTabResponse {
  success: boolean;
  cards: TeamCard;
  staff: StaffItem[];
  pagination: PaginationInfo;
}

// ── Posts Tab Types ──

export interface PostItem {
  id: string;
  category: string;
  title: string;
  content: string;
  likes: number;
  court: string | null;
  is_suspended?: boolean;
  created_at: string;
}

export interface PostsTabResponse {
  success: boolean;
  total_posts: number;
  posts: PostItem[];
  pagination: PaginationInfo;
}

// ── Commission Types ──

export interface CommissionResponse {
  success: boolean;
  percentage: number;
  is_set: boolean;
}

export interface CommissionUpdateResponse {
  success: boolean;
  message: string;
  percentage: number;
}

export interface CommissionUpdatePayload {
  percentage: number;
}

export interface CommissionResponse {
  success: boolean;
  percentage: number;
  is_set: boolean;
}

export interface CommissionUpdateResponse {
  success: boolean;
  message: string;
  percentage: number;
}

export interface CommissionUpdatePayload {
  percentage: number;
}
