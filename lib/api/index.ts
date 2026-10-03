import apiClient from "./client";
import type { AuthUser, LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import type { ApiEnvelope, Paginated, AdminDashboard, Assessment, UserProfile, Problem, Attempt, Invitation } from "@/types/api";

const unwrap = <T>(response: { data: ApiEnvelope<T> }) => response.data.data;

export const authApi = {
  login: async (body: LoginRequest) => unwrap<LoginResponse>(await apiClient.post("/auth/login", body)),
  register: async (body: RegisterRequest) => unwrap<{ message: string }>(await apiClient.post("/auth/register", body)),
  logout: async () => apiClient.post("/auth/logout"),
  me: async () => unwrap<UserProfile>(await apiClient.get("/users/me")),
};

export const adminApi = {
  dashboard: async () => unwrap<AdminDashboard>(await apiClient.get("/admin/dashboard")),
  users: async (params: Record<string, string | number>) => unwrap<Paginated<UserProfile>>((await apiClient.get("/admin/users", { params }))),
  logs: async (params: Record<string, string | number>) => unwrap<Paginated<Record<string, unknown>>>(await apiClient.get("/admin/audit-logs", { params })),
  updateStatus: async (id: string, status: string) => unwrap<UserProfile>(await apiClient.patch(`/admin/users/${id}/status`, { status })),
};

export const assessmentApi = {
  list: async (params: Record<string, string | number>) => unwrap<Paginated<Assessment>>(await apiClient.get("/assessments", { params })),
  get: async (id: string) => unwrap<Assessment>(await apiClient.get(`/assessments/${id}`)),
  create: async (body: { title: string; description?: string; durationMinutes: number; passingScore: number }) => unwrap<Assessment>(await apiClient.post("/assessments", body)),
  addItem: async (id: string, body: { problemId: string; order: number }) => unwrap<Assessment>(await apiClient.post(`/assessments/${id}/items`, body)),
  ready: async (id: string) => unwrap<Assessment>(await apiClient.post(`/assessments/${id}/ready`)),
  checkout: async (id: string) => unwrap<{ checkoutUrl: string }>(await apiClient.post(`/assessments/${id}/payment`)),
  invite: async (id: string, email: string) => unwrap<Invitation>(await apiClient.post(`/assessments/${id}/invitations`, { candidateEmail: email })),
};

export const problemApi = {
  list: async (params: Record<string, string | number>) => unwrap<Paginated<Problem>>(await apiClient.get("/problems", { params })),
  create: async (body: Record<string, unknown>) => unwrap<Problem>(await apiClient.post("/problems", body)),
};

export const candidateApi = {
  invitations: async () => unwrap<Paginated<Invitation>>(await apiClient.get("/invitations/candidate-invitations")),
  attempts: async () => unwrap<Paginated<Attempt>>(await apiClient.get("/attempts")),
  accept: async (token: string) => unwrap<Invitation>(await apiClient.post(`/invitations/${token}/accept`)),
};

export const profileApi = {
  update: async (name: string) => unwrap<UserProfile>(await apiClient.patch("/users/me", { name })),
};

export { apiClient };
