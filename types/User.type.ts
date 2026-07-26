export interface UserResult {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  matches: number;
  status: 'active' | 'suspended';
  date_joined: string;
  photo_url: string;
  avatar_url: string;
}

export interface UsersListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserResult[];
}

export interface UsersQuery {
  search?: string;
  status?: 'active' | 'suspended';
  page?: number;
}

export interface UserCounts {
  posts: number;
  followers: number;
  following: number;
}

export interface PlayerCardStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface PlayerCard {
  overall_rating: number;
  country: string;
  football_level: string;
  stats: PlayerCardStats;
}

export interface MatchSummary {
  matches: number;
  win: number;
  lose: number;
  draw: number;
  mvp: number;
  win_rate: number;
}

export interface RecentMatch {
  id: string;
  played_at: string;
  team_a_name: string;
  team_b_name: string;
  score_a: number;
  score_b: number;
  result: 'win' | 'lose' | 'draw';
}

export interface Report {
  id: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewed' | 'resolved';
  reported_by: string;
  created_at: string;
}

export interface UserDetail {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  status: 'active' | 'suspended';
  is_email_verified: boolean;
  date_joined: string;
  username: string;
  bio: string;
  photo_url: string;
  avatar_url: string;
  counts: UserCounts;
  player_card: PlayerCard;
  match_summary: MatchSummary;
  recent_matches: RecentMatch[];
  reports: Report[];
}