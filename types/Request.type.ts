export interface RequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface RequestResult {
  id: string;
  applicant_name: string;
  applicant_email: string;
  facility_name: string;
  location: string;
  number_of_courts: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface RequestDetail {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  website: string;
  country: string;
  city: string;
  state_province: string;
  street_address: string;
  zip_postal_code: string;
  full_address: string;
  facility_name: string;
  club_name: string;
  club_status: string;
  court_type: string;
  number_of_courts: number;
  sport: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface RequestsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RequestResult[];
}

export interface RequestsQuery {
  search?: string;
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
}