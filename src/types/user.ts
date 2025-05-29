import type { Language } from '@/hooks/useLanguage';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  language: Language;
  createdAt: string;
  updatedAt: string;
} 