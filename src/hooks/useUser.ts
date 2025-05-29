import { useCallback } from 'react';
import { useUserStore } from '@/store/user/userStore';
import { useToast } from '@/hooks/useToast';
import { useLanguage, type Language } from '@/hooks/useLanguage';
import type { UserProfile } from '@/store/user/userStore';

export const useUser = () => {
  const { user, updateUser: updateStoreUser, logout: logoutStore } = useUserStore();
  const { toast } = useToast();
  const { setLanguage } = useLanguage();

  const updateUser = useCallback(async (data: Partial<UserProfile>) => {
    try {
      await updateStoreUser(data);
      toast({
        message: 'Profil güncellendi',
        title: 'Profil güncellendi',
        description: 'Değişiklikleriniz başarıyla kaydedildi.',
        variant: 'success',
      });
    } catch (error) {
      toast({
        message: 'Hata',
        title: 'Hata',
        description: 'Profil güncellenirken bir hata oluştu.',
        variant: 'error',
      });
    }
  }, [updateStoreUser, toast]);

  const logout = useCallback(async () => {
    try {
      await logoutStore();
      toast({
        message: 'Çıkış yapıldı',
        title: 'Çıkış yapıldı',
        description: 'Başarıyla çıkış yaptınız.',
        variant: 'info',
      });
    } catch (error) {
      toast({
        message: 'Hata',
        title: 'Hata',
        description: 'Çıkış yapılırken bir hata oluştu.',
        variant: 'error',
      });
    }
  }, [logoutStore, toast]);

  const updateLanguage = useCallback((language: Language) => {
    setLanguage(language);
    updateUser({ language });
  }, [setLanguage, updateUser]);

  return {
    user,
    updateUser,
    logout,
    updateLanguage,
    isAuthenticated: !!user,
  };
}; 