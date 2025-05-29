import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  language: string;
  healthStatus: 'active' | 'inactive';
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    newsletter: boolean;
  };
  lastActivity?: {
    type: string;
    timestamp: string;
    details: string;
  };
}

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  updateUser: (data: Partial<UserProfile>) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      setUser: (user) => set({ user, error: null }),
      logout: () => set({ user: null, error: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
); 