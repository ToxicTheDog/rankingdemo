/* ═══════════════════════════════════════════════════════════════
   API SERVICE
   Central place for all backend calls.
   ═══════════════════════════════════════════════════════════════ */

const BASE_URL = "http://localhost:5000/api/v2";

/** Helper: make a fetch call with JSON body and auth header */
async function request<T>(
  endpoint: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    token?: string;
  } = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

/* ═══════════════════════════════════════
   AUTH ENDPOINTS (/auth)
   ═══════════════════════════════════════ */

export interface LoginRequest {
  mail: string;
  password: string;
}

export interface RegisterRequest {
  mail: string;
  fullName: string;
  password: string;
  phoneNumber?: string;
  date?: string;
  address?: string;
  city?: string;
  country?: string;
  username?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export interface MeResponse {
  success: boolean;
  user: Record<string, any>;
}

/** POST /auth/login */
export const authLogin = (data: LoginRequest) =>
  request<AuthResponse>("/auth/login", { method: "POST", body: data });

/** POST /auth/register */
export const authRegister = (data: RegisterRequest) =>
  request<AuthResponse>("/auth/register", { method: "POST", body: data });

/** GET /auth/me — get current user from token */
export const authMe = (token: string) =>
  request<MeResponse>("/auth/me", { token });

/** GET /auth/check-username?username=... — Check if username is available
 *  NOTE: You need to implement this endpoint on your backend */
export const checkUsernameAvailability = (username: string) =>
  request<{ available: boolean }>(`/auth/check-username?username=${encodeURIComponent(username)}`);

/* ═══════════════════════════════════════
   IMAGE UPLOAD (/upload)
   ═══════════════════════════════════════ */

/** POST /upload/image — FormData with "image" field */
export const uploadImage = async (file: File, token: string): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append("image", file);

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}/upload/image`, {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Upload failed: ${res.status}`);
  }

  return res.json();
};

/* ═══════════════════════════════════════
   MENTORS (/mentors)
   ═══════════════════════════════════════ */

export interface MentorData {
  id: string;
  name: string;
  description: string;
  score: number;
  imageUrl: string;
  specialty: string;
  students: number;
}

/** GET /mentors */
export const getMentors = () =>
  request<{ success: boolean; data: MentorData[] }>("/mentors");

/** POST /mentors (zaštićeno) */
export const createMentor = (data: Omit<MentorData, "id">, token: string) =>
  request<{ success: boolean; data: MentorData }>("/mentors", { method: "POST", body: data, token });

/** PUT /mentors/:id (zaštićeno) */
export const updateMentor = (id: string, data: Omit<MentorData, "id">, token: string) =>
  request<{ success: boolean; data: MentorData }>(`/mentors/${id}`, { method: "PUT", body: data, token });

/** DELETE /mentors/:id (zaštićeno) */
export const deleteMentor = (id: string, token: string) =>
  request<{ success: boolean }>(`/mentors/${id}`, { method: "DELETE", token });

/* ═══════════════════════════════════════
   AFFILIATES (/affiliates)
   ═══════════════════════════════════════ */

export interface AffiliateData {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  active: boolean;
  joinDate: string;
  points: number;
  referrals: AffiliateData[];
}

/** GET /affiliates */
export const getAffiliates = (token: string) =>
  request<{ success: boolean; data: AffiliateData[] }>("/affiliates", { token });

/* ═══════════════════════════════════════
   RANKINGS (/rankings)
   ═══════════════════════════════════════ */

/** GET /rankings — top 50 by totalPoints */
export const getRankings = () =>
  request<{ success: boolean; data: any[] }>("/rankings");

/** GET /rankings/me (zaštićeno) */
export const getMyRanking = (token: string) =>
  request<{ success: boolean; data: any }>("/rankings/me", { token });

/* ═══════════════════════════════════════
   PAYOUTS (/payouts)
   ═══════════════════════════════════════ */

export interface PayoutRequestData {
  id: string;
  userId: string;
  name: string;
  email: string;
  imageUrl: string;
  amount: number;
  points: number;
  rank: string;
  method: "bank" | "crypto";
  bankName?: string;
  iban?: string;
  swift?: string;
  network?: string;
  walletAddress?: string;
  referralCount: number;
  joinDate: string;
  requestDate: string;
}

export interface PayoutHistoryData extends PayoutRequestData {
  approvedDate: string;
}

/** GET /payouts/requests (zaštićeno) */
export const getPayoutRequests = (token: string) =>
  request<{ success: boolean; data: PayoutRequestData[] }>("/payouts/requests", { token });

/** POST /payouts/requests (zaštićeno) — submit payout request */
export const submitPayoutRequest = (
  data: { id: string; payout: { amount: number; type: string; details: Record<string, string> } },
  token: string
) =>
  request<{ success: boolean }>("/payouts/requests", { method: "POST", body: data, token });

/** POST /payouts/approve (zaštićeno — admin) */
export const approvePayout = (requestId: string, token: string) =>
  request<{ success: boolean }>("/payouts/approve", { method: "POST", body: { requestId }, token });

/** GET /payouts/history (zaštićeno) */
export const getPayoutHistory = (token: string) =>
  request<{ success: boolean; data: PayoutHistoryData[] }>("/payouts/history", { token });

/* ═══════════════════════════════════════
   DASHBOARD (/dashboard)
   ═══════════════════════════════════════ */

export interface DashboardStats {
  totalAffiliates: number;
  pendingPayouts: number;
  totalRevenue?: number;
  totalPayout?: number;
  profit?: number;
  revenueChange?: number;
  payoutChange?: number;
  profitChange?: number;
  totalClients?: number;
  deactivated?: number;
  expelled?: number;
}

/** GET /dashboard/stats (zaštićeno) */
export const getDashboardStats = (token: string) =>
  request<{ success: boolean; data: DashboardStats }>("/dashboard/stats", { token });

export interface TransactionData {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
}

/** GET /dashboard/transactions (zaštićeno) */
export const getTransactions = (token: string) =>
  request<{ success: boolean; data: TransactionData[] }>("/dashboard/transactions", { token });
