import { create } from "zustand";
import type { User, UserRole } from "@/src/types";

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole, allUsers: User[]) => void;
  setCurrentUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false,

  login: (user) =>
    set({ currentUser: user, isAuthenticated: true }),

  logout: () =>
    set({ currentUser: null, isAuthenticated: false }),

  switchRole: (role, allUsers) => {
    const userForRole = allUsers.find((u) => u.role === role);
    if (userForRole) {
      set({ currentUser: userForRole, isAuthenticated: true });
    }
  },

  setCurrentUser: (user) =>
    set({ currentUser: user }),
}));
