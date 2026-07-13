// types/Payment.type.ts

export interface PaymentStats {
  success: boolean;
  total_revenue: string;
  platform_commission: string;
  pending_payments: string;
  completed_transactions: number;
}

export interface PaymentManager {
  id: string;
  name: string;
  email: string;
}

export interface PaymentResult {
  id: string;
  code: string;
  court_manager: PaymentManager;
  courts: string;
  period: string;
  amount: string;
  status: 'pending' | 'paid' | 'rejected';
  created_at: string;
}

export interface PaymentsListResponse {
  success: boolean;
  results: PaymentResult[];
  pagination: {
    count: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
}

export interface PaymentsQuery {
  search?: string;
  status?: 'pending' | 'paid' | 'rejected';
  page?: number;
}

// ── Payment Details Types ──

export interface PaymentManagerInfo {
  name: string;
  courts_name: string;
  email: string;
  phone: string;
}

export interface FinancialSummary {
  period: string;
  withdrawal_amount: string;
  platform_fee_percent: string;
  platform_fee_amount: string;
  remaining_balance: string;
}

export interface PaymentInfo {
  paypal_email: string;
  bank_account: string;
}

export interface PaymentActivity {
  id: string;
  title: string;
  note: string;
  by: string;
  created_at: string;
}

export interface PaymentDetail {
  id: string;
  code: string;
  court_manager: PaymentManager;
  courts: string;
  period: string;
  amount: string;
  status: 'pending' | 'paid' | 'rejected';
  created_at: string;
  manager_info: PaymentManagerInfo;
  financial_summary: FinancialSummary;
  payment_info: PaymentInfo;
  activities: PaymentActivity[];
  reviewed_at: string | null;
}

export interface PaymentDetailResponse {
  success: boolean;
  payment: PaymentDetail;
}

// ── Approve/Reject Types ──

export interface ApprovePaymentResponse {
  success: boolean;
  message: string;
  status: string;
}

export interface RejectPaymentPayload {
  note: string;
}

export interface RejectPaymentResponse {
  success: boolean;
  message: string;
  status: string;
}