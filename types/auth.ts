export type UserRole = "ADMIN" | "CANDIDATE" | "RECRUITER";

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    status?: string;
    avatarUrl?: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: AuthUser;
    accessToken?: string;
    refreshToken?: string;
}

export interface RegisterRequest { name: string; email: string; password: string; role?: Exclude<UserRole, "ADMIN">; }
