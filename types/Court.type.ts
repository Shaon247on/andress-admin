export interface CourtStats {
  success: boolean;
  total: number;
  active: number;
  in_maintenance: number;
  available_now: number;
}

export interface CourtResult {
  id: string;
  court_id: string;
  name: string;
  facility: string;
  manager: string;
  location: string;
  court_type: 'indoor' | 'outdoor' | 'both';
  sport: string;
  surface: string;
  price_per_hour: string;
  bookings: number;
  status: 'active' | 'under_maintenance' | 'closed';
  availability: 'available' | 'booked' | 'maintenance';
}

export interface CourtsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CourtResult[];
}

export interface CourtsQuery {
  search?: string;
  status?: 'active' | 'under_maintenance' | 'closed';
  court_type?: 'indoor' | 'outdoor' | 'both';
  page?: number;
}