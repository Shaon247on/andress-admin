export interface RevenueStats {
  success: boolean;
  total_revenue: string;
  platform_commission: string;
  user_commission: string;
  completed_withdrawals: string;
  available_balance: string;
}

export interface RevenueUser {
  id: string;
  name: string;
  email: string;
}

export interface RevenueHistoryItem {
  id: string;
  code: string;
  user: RevenueUser;
  amount: string;
  date: string;
  remaining_balance: string;
}

export interface RevenueHistoryResponse {
  success: boolean;
  results: RevenueHistoryItem[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface WithdrawPayload {
  amount: string;
}

export interface WithdrawResponse {
  success: boolean;
  message: string;
  code: string;
  amount: string;
  available_balance: string;
}