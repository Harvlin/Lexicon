/* Lightweight API client for Lexigrain frontend */
function resolveApiBase() {
  const envBase = import.meta.env.VITE_API_BASE as string | undefined;
  if (envBase) return envBase;
  // If running on a hosted domain (not localhost), prefer same-origin '/api'
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return `${window.location.origin}/api`;
    }
  }
  // Fallback for local dev
  return "http://localhost:8080/api";
}
export const API_BASE = resolveApiBase();

// Simple token storage
const AUTH_TOKEN_KEY = "lexigrain:authToken";
export function setAuthToken(token: string | null) {
  if (!token) return localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}
export function getAuthToken(): string | null {
  try { return localStorage.getItem(AUTH_TOKEN_KEY); } catch { return null; }
}
export function clearAuthToken() { try { localStorage.removeItem(AUTH_TOKEN_KEY); } catch {} }

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  // Only omit Authorization for public auth endpoints (login/register). Auth/me requires JWT
  const isPublicAuth = path === '/auth/login' || path === '/auth/register';
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // Don't send Authorization for public auth endpoints to avoid backend JWT parsing on stale tokens
      ...(!isPublicAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    // On 401/403, clear token so app can recover gracefully
    if (res.status === 401 || res.status === 403) {
      try { clearAuthToken(); } catch {}
    }
    const text = await res.text().catch(() => "");
    throw new Error(`API ${options.method || "GET"} ${path} failed: ${res.status} ${text}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

/**
 * fetchWithFallback: attempt API then fall back to provided local value/function.
 * - timeouts after 6s by default
 */
export async function fetchWithFallback<T>(
  apiCall: () => Promise<T>,
  fallback: T | (() => T),
  opts: { timeoutMs?: number } = {}
): Promise<{ data: T; source: 'api' | 'fallback' }> {
  const timeoutMs = opts.timeoutMs ?? 6000;
  const to = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('timeout')), timeoutMs));
  try {
    const data = await Promise.race([apiCall(), to]);
    // If API returns undefined/null, still use fallback to avoid breaking UI
    if (data === undefined || data === null) throw new Error('empty');
    return { data: data as T, source: 'api' };
  } catch {
    const data = (typeof fallback === 'function' ? (fallback as () => T)() : fallback);
    return { data, source: 'fallback' };
  }
}

// Convenience typed endpoints (expand as we wire pages)
import type { UserDTO, UserProgressSummaryDTO, LessonDTO, ApiList, QuizQuestionDTO, FlashcardDTO, QuizAnswerDTO, QuizSubmissionResultDTO, OnboardingDTO, ScheduleWeekDTO, ScheduleSessionDTO, ChatRequestDTO, ChatMessageDTO, NotificationPrefsDTO, AuthResponseDTO, MessageResponseDTO } from "./types";

export const endpoints = {
  auth: {
    login: (payload: { email: string; password: string }) => api.post<AuthResponseDTO>(`/auth/login`, payload),
    register: (payload: { name: string; email: string; password: string; role?: string; goals?: string[] }) =>
      api.post<MessageResponseDTO>(`/auth/register`, payload),
    me: () => api.get<AuthResponseDTO>(`/auth/me`),
  },
  me: {
    // Map backend auth/me response into a simple UserDTO
    get: async () => {
      const auth = await api.get<AuthResponseDTO>(`/auth/me`);
      // Prefer flattened fields, fallback to nested user
      const name = auth.name || auth.user?.name || "";
      const email = auth.email || auth.user?.email || "";
      return { name, email } as UserDTO;
    },
    // Placeholder: if backend later exposes profile update endpoint, point this there
    update: (data: Partial<UserDTO>) => api.put<UserDTO>(`/me`, data),
  },
  progress: {
    summary: () => api.get<UserProgressSummaryDTO>(`/progress/summary`),
  },
  lessons: {
    list: (query?: Record<string, string | number | boolean | undefined>) => {
      const qs = query
        ? "?" + new URLSearchParams(
            Object.entries(query).reduce((acc, [k, v]) => {
              if (v !== undefined && v !== null) acc[k] = String(v);
              return acc;
            }, {} as Record<string, string>)
          ).toString()
        : "";
      return api.get<ApiList<LessonDTO>>(`/lessons${qs}`);
    },
    get: (id: string) => api.get<LessonDTO>(`/lessons/${id}`),
    toggleFavorite: (id: string) => api.post<void>(`/lessons/${id}/favorite`),
    quiz: (id: string) => api.get<QuizQuestionDTO[]>(`/lessons/${id}/quiz`),
    flashcards: (id: string) => api.get<FlashcardDTO[]>(`/lessons/${id}/flashcards`),
    complete: (id: string) => api.post<void>(`/lessons/${id}/complete`),
    submitQuiz: (id: string, answers: QuizAnswerDTO[]) => api.post<QuizSubmissionResultDTO>(`/lessons/${id}/quiz/submissions`, { answers }),
  },
  categories: {
    list: () => api.get<string[]>(`/categories`),
  },
  onboarding: {
    get: () => api.get<OnboardingDTO>(`/onboarding/me`),
    save: (data: OnboardingDTO) => api.put<OnboardingDTO>(`/onboarding/me`, data),
  },
  schedule: {
    getWeek: (weekId: string) => api.get<ScheduleWeekDTO>(`/schedule/weeks/${encodeURIComponent(weekId)}`),
    saveWeek: (weekId: string, data: ScheduleWeekDTO) => api.put<ScheduleWeekDTO>(`/schedule/weeks/${encodeURIComponent(weekId)}`, data),
    addSession: (weekId: string, session: Omit<ScheduleSessionDTO,'id'|'createdAt'|'updatedAt'>) => api.post<ScheduleSessionDTO>(`/schedule/weeks/${encodeURIComponent(weekId)}/sessions`, session),
    updateSession: (weekId: string, id: string, patch: Partial<ScheduleSessionDTO>) => api.patch<ScheduleSessionDTO>(`/schedule/weeks/${encodeURIComponent(weekId)}/sessions/${id}`, patch),
    deleteSession: (weekId: string, id: string) => api.delete<void>(`/schedule/weeks/${encodeURIComponent(weekId)}/sessions/${id}`),
  },
  chat: {
    ask: (payload: ChatRequestDTO) => api.post<ChatMessageDTO>(`/ai/chat`, payload),
  },
  settings: {
    getNotifications: () => api.get<NotificationPrefsDTO>(`/me/notifications`),
    updateNotifications: (prefs: NotificationPrefsDTO) => api.put<NotificationPrefsDTO>(`/me/notifications`, prefs),
    // Backend implements change password under /auth
    changePassword: (payload: { currentPassword: string; newPassword: string }) => api.post<void>(`/auth/change-password`, payload),
  }
};
