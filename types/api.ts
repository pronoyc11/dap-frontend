export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}
export interface ApiEnvelope<T> { success: boolean; message: string; data: T; }
export interface Pagination { page: number; limit: number; total: number; totalPages: number; }
export interface Paginated<T> { pagination: Pagination; users?: T[]; assessments?: T[]; problems?: T[]; invitations?: T[]; attempts?: T[]; logs?: T[]; }
export interface AdminDashboard { users: { total: number; candidates: number; recruiters: number; admins: number; active: number; blocked: number }; assessments: { total: number; published: number }; attempts: { total: number }; payments: { total: number; paid: number }; }
export interface Assessment { id: string; title: string; description?: string | null; durationMinutes: number; passingScore: number; status: string; itemCount: number; createdAt: string; updatedAt: string; items?: AssessmentItem[]; }
export interface AssessmentItem { id: string; title: string; question: string; type: "MCQ" | "WRITTEN"; options: string[]; points: number; }
export interface Problem { id: string; title: string; question: string; type: "MCQ" | "WRITTEN"; points: number; options?: string[]; }
export interface UserProfile { id: string; name: string; email: string; role: string; status: string; recruiterStatus?: string; avatarUrl?: string | null; createdAt?: string; }
export interface Invitation { id: string; email?: string; token?: string; status: string; assessment?: Assessment; }
export interface Attempt { id: string; status: string; score?: number | null; assessment?: Assessment; }
