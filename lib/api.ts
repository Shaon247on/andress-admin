/**
 * API Integration Scope
 * This file serves as a central hub for all API calls in the application.
 * Replace the dummy implementations with actual fetch calls or SDK interactions.
 */

// User Authentication
export const login = async (credentials: any) => {
  console.log('API: login', credentials);
  return { token: 'dummy_token', user: { name: 'Andreas', role: 'admin' } };
};

export const resetPassword = async (email: string) => {
  console.log('API: resetPassword', email);
  return { success: true };
};

// Dashboard Data
export const getDashboardStats = async () => {
  console.log('API: getDashboardStats');
  return {
    totalUsers: 12543,
    totalRevenue: 12543,
    pendingRequests: 43,
    activeBookings: 8240,
  };
};

export const getBookingTrend = async () => {
  console.log('API: getBookingTrend');
  return [
    { name: 'Mon', value: 8 },
    { name: 'Tue', value: 12 },
    { name: 'Wed', value: 10 },
    { name: 'Thu', value: 15 },
    { name: 'Fri', value: 18 },
    { name: 'Sat', value: 22 },
    { name: 'Sun', value: 20 },
  ];
};

export const getCourtUtilization = async () => {
  console.log('API: getCourtUtilization');
  return [
    { name: 'Arena Pro', percentage: 85 },
    { name: 'Gemna Silva', percentage: 72 },
    { name: 'Stadium Pro', percentage: 68 },
    { name: 'Flora Stadium', percentage: 91 },
  ];
};

export const getTodaysBookings = async () => {
  console.log('API: getTodaysBookings');
  return [
    { id: 1, court: 'Court A - Elite Sports', courtName: 'Court D', time: '09:00 AM', customer: 'John Smith', status: 'Confirmed' },
    { id: 2, court: 'Court B - Downtown Courts', courtName: 'Court A', time: '10:30 AM', customer: 'Emily Davis', status: 'Confirmed' },
    { id: 3, court: 'Court C - Riverside Arena', courtName: 'Court D', time: '02:00 PM', customer: 'Michael Brown', status: 'Pending' },
    { id: 4, court: 'Court A - Elite Sports', courtName: 'Court C', time: '04:00 PM', customer: 'Sarah Wilson', status: 'Confirmed' },
    { id: 5, court: 'Court D - City Sports Hub', courtName: 'Court B', time: '06:30 PM', customer: 'David Lee', status: 'Confirmed' },
  ];
};
