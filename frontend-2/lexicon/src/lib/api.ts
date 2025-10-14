/* Lightweight API client for Lexigrain frontend */
export const API_BASE = import.meta.env.VITE_API_BASE || "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
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

// Convenience typed endpoints (expand as we wire pages)
import type { UserDTO, UserProgressSummaryDTO, LessonDTO, ApiList, QuizQuestionDTO, FlashcardDTO, QuizAnswerDTO, QuizSubmissionResultDTO, OnboardingDTO, ScheduleWeekDTO, ScheduleSessionDTO } from "./types";

export const endpoints = {
  me: {
    get: () => api.get<UserDTO>(`/me`),
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
};
