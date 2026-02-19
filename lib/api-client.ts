const API_BASE = "";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const json = await res.json();
  if (!res.ok) {
    return {
      error: json.error || "Something went wrong",
      details: json.details,
    };
  }
  return { data: json as T };
}

// Auth API
export async function apiRegister(body: {
  name: string;
  email: string;
  password: string;
  adminCode?: string;
}) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse<{
    message: string;
    token: string;
    user: UserData;
  }>(res);
}

export async function apiLogin(body: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse<{
    message: string;
    token: string;
    user: UserData;
  }>(res);
}

export async function apiGetMe() {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: authHeaders(),
  });
  return handleResponse<{ user: UserData }>(res);
}

// Rounds API
export async function apiVerifyRound(body: {
  roundNumber: number;
  accessCode: string;
}) {
  const res = await fetch(`${API_BASE}/api/rounds/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  return handleResponse<{
    message: string;
    roundNumber: number;
    verified: boolean;
  }>(res);
}

// Submissions API
export async function apiCreateSubmission(formData: FormData) {
  const res = await fetch(`${API_BASE}/api/submissions`, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  return handleResponse<{
    message: string;
    submission: SubmissionData;
  }>(res);
}

export async function apiGetMySubmissions() {
  const res = await fetch(`${API_BASE}/api/submissions`, {
    headers: authHeaders(),
  });
  return handleResponse<{ submissions: SubmissionData[] }>(res);
}

// Admin API
export async function apiGetAllUsers() {
  const res = await fetch(`${API_BASE}/api/admin/users`, {
    headers: authHeaders(),
  });
  return handleResponse<{ users: UserData[] }>(res);
}

export async function apiGetAllSubmissions() {
  const res = await fetch(`${API_BASE}/api/admin/submissions`, {
    headers: authHeaders(),
  });
  return handleResponse<{
    submissions: Record<number, AdminSubmissionData[]>;
    total: number;
  }>(res);
}

// Types
export interface UserData {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface SubmissionData {
  id: string;
  roundNumber: number;
  imageName: string;
  teamName: string;
  prompt: string;
  imagePath: string;
  submittedAt: string;
}

export interface AdminSubmissionData extends SubmissionData {
  userName: string;
  userEmail: string;
  rank: number;
}
