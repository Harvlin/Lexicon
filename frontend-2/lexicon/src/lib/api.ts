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
    // Do NOT blindly clear token on any 401/403, because some endpoints may be
    // unavailable/not yet implemented and secured by the backend, which would
    // accidentally log users out. Token lifecycle is managed by auth flows.
    // We only surface the error here; callers can decide how to react.
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
import type {
  UserDTO,
  UserProgressSummaryDTO,
  LessonDTO,
  ApiList,
  QuizQuestionDTO,
  FlashcardDTO,
  QuizAnswerDTO,
  QuizSubmissionResultDTO,
  OnboardingDTO,
  ScheduleWeekDTO,
  ScheduleSessionDTO,
  ChatRequestDTO,
  ChatMessageDTO,
  NotificationPrefsDTO,
  AuthResponseDTO,
  MessageResponseDTO,
  StudyVideosResponseDTO,
  StudyVideoDetailResponseDTO,
  StudyVideoQuestionDTO,
  StudyFlashcardDTO,
  ProcessResponseDTO
} from "./types";

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
    weeklyActivity: () => api.get<{ day: string; date: string; lessons: number; points: number; minutes: number }[]>(`/progress/activity/weekly`),
    timeStats: () => api.get<{ totalTime: number; thisWeek: number; thisMonth: number; avgDaily: number }>(`/progress/time-stats`),
    migrateLocal: (completedVideos: Record<string, { completedAt: string; title?: string; duration?: number }>) => 
      api.post<{ status: string; migrated: number; errors: string[]; message: string }>(`/progress/migrate-local`, { completedVideos }),
  },
  dashboard: {
    recentActivity: (days?: number, limit?: number) => {
      const qs = new URLSearchParams();
      if (days) qs.set('days', String(days));
      if (limit) qs.set('limit', String(limit));
      return api.get<{ status: string; count: number; activities: any[]; since: string }>(`/dashboard/recent-activity${qs.toString() ? '?' + qs.toString() : ''}`);
    },
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
    complete: (id: string, body?: { actualMinutes?: number }) => 
      api.post<{ status: string; lessonId: string; completedAt: string; message: string }>(`/lessons/${id}/complete`, body),
    toggleFavorite: (id: string) => api.post<{ status: string; lessonId: string; isFavorite: boolean }>(`/lessons/${id}/favorite`),
    favorited: () => api.get<ApiList<LessonDTO>>(`/lessons/favorited`),
    quiz: (id: string) => api.get<QuizQuestionDTO[]>(`/lessons/${id}/quiz`),
    flashcards: (id: string) => api.get<FlashcardDTO[]>(`/lessons/${id}/flashcards`),
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
  },
  studyMaterials: {
    videos: () => api.get<StudyVideosResponseDTO>(`/study-materials/videos`),
    videosByTopic: (topic: string) => api.get<StudyVideosResponseDTO>(`/study-materials/videos/topic/${encodeURIComponent(topic)}`),
    video: (videoId: number) => api.get<StudyVideoDetailResponseDTO>(`/study-materials/videos/${videoId}`),
    completeVideo: (videoId: number) => api.post<{ status: string; message: string; videoId: number; completedAt: string }>(`/study-materials/videos/${videoId}/complete`),
    toggleFavoriteVideo: (videoId: number) => api.post<{ status: string; videoId: number; isFavorite: boolean }>(`/study-materials/videos/${videoId}/favorite`),
    videoQuestions: (videoId: number) => api.get<{ status: string; videoId: number; count: number; questions: StudyVideoQuestionDTO[] }>(`/study-materials/videos/${videoId}/questions`),
    videoFlashcards: (videoId: number) => api.get<{ status: string; videoId: number; count: number; flashcards: StudyFlashcardDTO[] }>(`/study-materials/videos/${videoId}/flashcards`),
    learningPlans: () => api.get<{ status: string; count: number; plans: { id: number; topic: string; userPreference: string; planContent: string; createdAt: string }[] }>(`/study-materials/learning-plans`),
  },
  process: {
    preference: (preference: string) => api.get<ProcessResponseDTO>(`/process/preference?preference=${encodeURIComponent(preference)}`),
    preview: (preference: string) => api.get<ProcessResponseDTO>(`/process/preference/preview?preference=${encodeURIComponent(preference)}`),
  }
};
