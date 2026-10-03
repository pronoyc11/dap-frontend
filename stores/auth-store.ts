import { create } from "zustand";
import type { AuthUser } from "@/types/auth";

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    setUser: (user: AuthUser | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>(
    
    (set) => (
        {
    user: null,
    isAuthenticated: false,

    setUser: (user) =>
        set({
            user,
            isAuthenticated: Boolean(user),
        }),

    clearAuth: () =>
        set({
            user: null,
            isAuthenticated: false,
        }),
     }
)

);