/* ═══════════════════════════════════════════════════════════════
   API SERVICE
   Central place for all backend calls.
   Change BASE_URL to point to your backend.
   ═══════════════════════════════════════════════════════════════ */

const BASE_URL = "http://localhost:3000/api/v2";

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
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

/* ═══════════════════════════════════════
   AUTH ENDPOINTS
   ═══════════════════════════════════════ */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string; // "admin" | "user" etc.
  };
}

/** POST /authorization/login
 * Body: { email: string, password: string }
 * Returns: { token, user: { id, email, name, role } }
 */
export const authLogin = (data: LoginRequest) =>
  request<AuthResponse>("/authorization/login", { method: "POST", body: data });

/** POST /authorization/register
 * Body: { email: string, password: string, name: string }
 * Returns: { token, user: { id, email, name, role } }
 */
export const authRegister = (data: RegisterRequest) =>
  request<AuthResponse>("/authorization/register", { method: "POST", body: data });

/* ═══════════════════════════════════════
   MENTORS ENDPOINTS
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

/** GET /mentors — Fetch all mentors */
export const getMentors = (token: string) =>
  request<MentorData[]>("/mentors", { token });

/** POST /mentors — Create a new mentor
 * Body: { name, description, score, imageUrl, specialty, students }
 */
export const createMentor = (data: Omit<MentorData, "id">, token: string) =>
  request<MentorData>("/mentors", { method: "POST", body: data, token });

/** PUT /mentors/:id — Update a mentor
 * Body: { name, description, score, imageUrl, specialty, students }
 */
export const updateMentor = (id: string, data: Omit<MentorData, "id">, token: string) =>
  request<MentorData>(`/mentors/${id}`, { method: "PUT", body: data, token });

/** DELETE /mentors/:id — Delete a mentor */
export const deleteMentor = (id: string, token: string) =>
  request<{ success: boolean }>(`/mentors/${id}`, { method: "DELETE", token });

/* ═══════════════════════════════════════
   AFFILIATES ENDPOINTS
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

/** GET /affiliates — Fetch all affiliate users */
export const getAffiliates = (token: string) =>
  request<AffiliateData[]>("/affiliates", { token });

/* ═══════════════════════════════════════
   PAYOUT ENDPOINTS
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

/** GET /payouts/requests — Fetch pending payout requests */
export const getPayoutRequests = (token: string) =>
  request<PayoutRequestData[]>("/payouts/requests", { token });

/** POST /payouts/approve — Approve a payout request
 * Body: { requestId: string }
 */
export const approvePayout = (requestId: string, token: string) =>
  request<{ success: boolean }>("/payouts/approve", { method: "POST", body: { requestId }, token });

/** GET /payouts/history — Fetch payout history */
export const getPayoutHistory = (token: string) =>
  request<PayoutHistoryData[]>("/payouts/history", { token });

/** POST /payouts/request — Submit a new payout request
 * Body: { method, amount, bankName?, iban?, swift?, walletAddress?, network? }
 */
export const submitPayoutRequest = (
  data: { method: string; amount: number; bankName?: string; iban?: string; swift?: string; walletAddress?: string; network?: string },
  token: string
) =>
  request<{ success: boolean }>("/payouts/request", { method: "POST", body: data, token });

/* ═══════════════════════════════════════
   DASHBOARD ENDPOINTS
   ═══════════════════════════════════════ */

export interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  deactivated: number;
  banned: number;
  totalClients: number;
}

/** GET /dashboard/stats — Fetch dashboard KPIs */
export const getDashboardStats = (token: string) =>
  request<DashboardStats>("/dashboard/stats", { token });

export interface TransactionData {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
}

/** GET /dashboard/transactions — Fetch recent transactions */
export const getTransactions = (token: string) =>
  request<TransactionData[]>("/dashboard/transactions", { token });
