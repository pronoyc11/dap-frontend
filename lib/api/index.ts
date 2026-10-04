import apiClient from "./client";
import type { LoginRequest, LoginResponse, RegisterRequest } from "@/types/auth";
import type { ApiEnvelope, Paginated, AdminDashboard, Assessment, UserProfile, Problem, Attempt, Invitation, RecruiterProfile, Submission } from "@/types/api";

const unwrap = <T>(response: { data: ApiEnvelope<T> }) => response.data.data;

export const authApi = {
  login: async (body: LoginRequest) => unwrap<LoginResponse>(await apiClient.post("/auth/login", body)),
  register: async (body: RegisterRequest) => unwrap<{ message: string }>(await apiClient.post("/auth/register", body)),
  logout: async () => apiClient.post("/auth/logout"),
  verifyEmail: async (token: string) => unwrap<{ message: string }>(await apiClient.post("/auth/verify-email", { token })),
  resendVerification: async (email: string) => unwrap<{ message: string }>(await apiClient.post("/auth/resend-verification", { email })),
  google: async (credential: string) => unwrap<LoginResponse>(await apiClient.post("/auth/google", { credential })),
  refresh: async () => unwrap<LoginResponse>(await apiClient.post("/auth/refresh")),
  me: async () => unwrap<UserProfile>(await apiClient.get("/users/me")),
};

export const adminApi = {
  dashboard: async () => unwrap<AdminDashboard>(await apiClient.get("/admin/dashboard")),
  users: async (params: Record<string, string | number>) => unwrap<Paginated<UserProfile>>((await apiClient.get("/admin/users", { params }))),
  logs: async (params: Record<string, string | number>) => unwrap<Paginated<Record<string, unknown>>>(await apiClient.get("/admin/audit-logs", { params })),
  log: async (id: string) => unwrap<Record<string, unknown>>(await apiClient.get(`/admin/audit-logs/${id}`)),
  user: async (id: string) => unwrap<UserProfile>(await apiClient.get(`/admin/users/${id}`)),
  recruiterApplications: async (params: Record<string, string | number>) => unwrap<Paginated<UserProfile>>(await apiClient.get("/admin/recruiter-applications", { params })),
  approveRecruiter: async (userId: string) => unwrap<UserProfile>(await apiClient.patch(`/admin/recruiter-applications/${userId}/approve`)),
  updateStatus: async (id: string, status: string) => unwrap<UserProfile>(await apiClient.patch(`/admin/users/${id}/status`, { status })),
};

export const assessmentApi = {
  list: async (params: Record<string, string | number>) => unwrap<Paginated<Assessment>>(await apiClient.get("/assessments", { params })),
  get: async (id: string) => unwrap<Assessment>(await apiClient.get(`/assessments/${id}`)),
  create: async (body: { title: string; description?: string; durationMinutes: number; passingScore: number }) => unwrap<Assessment>(await apiClient.post("/assessments", body)),
  addItem: async (id: string, body: { problemId: string; order: number }) => unwrap<Assessment>(await apiClient.post(`/assessments/${id}/items`, body)),
  update: async (id: string, body: { title?: string; description?: string | null; durationMinutes?: number; passingScore?: number }) => unwrap<Assessment>(await apiClient.patch(`/assessments/${id}`, body)),
  remove: async (id: string) => unwrap<null>(await apiClient.delete(`/assessments/${id}`)),
  updateItem: async (id: string, itemId: string, order: number) => unwrap<Assessment>(await apiClient.patch(`/assessments/${id}/items/${itemId}`, { order })),
  removeItem: async (id: string, itemId: string) => unwrap<null>(await apiClient.delete(`/assessments/${id}/items/${itemId}`)),
  reorder: async (id: string, items: { itemId: string; order: number }[]) => unwrap<Assessment>(await apiClient.patch(`/assessments/${id}/items/reorder`, { items })),
  ready: async (id: string) => unwrap<Assessment>(await apiClient.post(`/assessments/${id}/ready`)),
  checkout: async (id: string) => unwrap<{ checkoutUrl: string }>(await apiClient.post(`/assessments/${id}/payment`)),
  invite: async (id: string, email: string) => unwrap<Invitation>(await apiClient.post(`/assessments/${id}/invitations`, { candidateEmail: email })),
  invitations: async (id: string, params: Record<string, string | number>) => unwrap<Paginated<Invitation>>(await apiClient.get(`/assessments/${id}/invitations`, { params })),
  submissions: async (id: string, params: Record<string, string | number>) => unwrap<Paginated<Submission>>(await apiClient.get(`/assessments/${id}/submissions`, { params })),
};

export const problemApi = {
  list: async (params: Record<string, string | number>) => unwrap<Paginated<Problem>>(await apiClient.get("/problems", { params })),
  get: async (id: string) => unwrap<Problem>(await apiClient.get(`/problems/${id}`)),
  create: async (body: Record<string, unknown>) => unwrap<Problem>(await apiClient.post("/problems", body)),
  update: async (id: string, body: Record<string, unknown>) => unwrap<Problem>(await apiClient.patch(`/problems/${id}`, body)),
  remove: async (id: string) => unwrap<null>(await apiClient.delete(`/problems/${id}`)),
};

export const candidateApi = {
  invitations: async () => unwrap<Paginated<Invitation>>(await apiClient.get("/invitations/candidate-invitations")),
  attempts: async () => unwrap<Paginated<Attempt>>(await apiClient.get("/attempts")),
  attempt: async (id: string) => unwrap<Attempt>(await apiClient.get(`/attempts/${id}`)),
  start: async (token: string) => unwrap<Attempt>(await apiClient.post(`/invitations/${token}/start`)),
  invitation: async (id: string) => unwrap<Invitation>(await apiClient.get(`/invitations/${id}`)),
  accept: async (token: string) => unwrap<Invitation>(await apiClient.post(`/invitations/${token}/accept`)),
  removeInvitation: async (id: string) => unwrap<null>(await apiClient.delete(`/invitations/${id}`)),
  submit: async (id: string, answers: { assessmentItemId: string; answer: string }[]) => unwrap<Attempt>(await apiClient.post(`/attempts/${id}/submit`, { answers })),
};

export const profileApi = {
  update: async (name: string) => unwrap<UserProfile>(await apiClient.patch("/users/me", { name })),
  changePassword: async (currentPassword: string, newPassword: string) => unwrap<{ message: string }>(await apiClient.patch("/users/me/password", { currentPassword, newPassword })),
  avatar: async (file: File) => { const body = new FormData(); body.append("avatar", file); return unwrap<UserProfile>(await apiClient.patch("/users/me/avatar", body, { headers: { "Content-Type": "multipart/form-data" } })); },
};

export const recruiterApi = {
  profile: async () => unwrap<RecruiterProfile>(await apiClient.get("/recruiters/me/profile")),
  update: async (body: { companyName?: string; companyDescription?: string; companyWebsite?: string }) => unwrap<RecruiterProfile>(await apiClient.patch("/recruiters/me/profile", body)),
  logo: async (file: File) => { const body = new FormData(); body.append("logo", file); return unwrap<RecruiterProfile>(await apiClient.patch("/recruiters/me/profile/logo", body, { headers: { "Content-Type": "multipart/form-data" } })); },
};

export const submissionApi = {
  evaluate: async (id: string, score: number, feedback?: string) => unwrap<Submission>(await apiClient.patch(`/submissions/${id}/evaluate`, { score, feedback })),
};

export { apiClient };
