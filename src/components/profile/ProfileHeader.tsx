'use client';

import * as React from 'react';
import { LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

import { Avatar } from '@/components/ui/avatar/Avatar';
import { Button } from '@/components/ui/button/Button';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import type { ToastVariant } from '@/types/toast';
import { cn } from '@/lib/utils/cn';
import type { Language } from '@/hooks/useLanguage';

const fadeIn = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

interface ProfileHeaderProps {
  className?: string;
}

export const ProfileHeader = React.forwardRef<HTMLElement, ProfileHeaderProps>(
  ({ className }, ref) => {
    const { user, logout, updateLanguage } = useUser();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const [isLoggingOut, setIsLoggingOut] = React.useState(false);

    if (!user) {
      return null;
    }

    const handleLogout = async () => {
      try {
        setIsLoggingOut(true);
        await logout();
        toast({
          title: 'Başarılı',
          message: 'Çıkış yapıldı',
          description: 'Başarıyla çıkış yaptınız.',
          variant: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Hata',
          message: 'Çıkış yapılamadı',
          description: 'Çıkış yapılırken bir hata oluştu. Lütfen tekrar deneyin.',
          variant: 'error',
          duration: 5000,
        });
      } finally {
        setIsLoggingOut(false);
      }
    };

    const handleThemeToggle = () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      toast({
        title: 'Tema değiştirildi',
        message: `${newTheme === 'dark' ? 'Koyu' : 'Açık'} temaya geçildi`,
        variant: 'info',
        duration: 2000,
      });
    };

    const handleSettingsClick = (e: React.MouseEvent) => {
      e.preventDefault();
      window.location.href = '/settings';
    };

    return (
      <motion.header
        ref={ref}
        className={cn(
          // Base styles
          'w-full bg-background border-b',
          'border-border/40 shadow-sm',
          // Spacing and layout
          'px-4 py-3 sm:px-6 lg:px-8',
          'sticky top-0 z-40',
          // Grid layout for responsive design
          'grid grid-cols-[auto,1fr,auto] items-center gap-4',
          className
        )}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={fadeIn}
        role="banner"
        aria-label="Profil başlığı"
      >
        {/* User Info & Avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar
            src={user.avatarUrl}
            alt={`${user.fullName} profil fotoğrafı`}
            fallback={user.fullName.charAt(0).toUpperCase()}
            className="h-10 w-10 sm:h-12 sm:w-12"
          />
          <div className="hidden sm:block">
            <h1 className="text-base font-semibold text-foreground/90">
              {user.fullName}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        {/* Spacer for center alignment */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector
            value={user.language as Language}
            onChange={updateLanguage}
            aria-label="Dil seçimi"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            aria-label={theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç'}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSettingsClick}
            aria-label="Ayarlar"
          >
            <Settings className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Çıkış yap"
            className={cn(
              "text-muted-foreground",
              "hover:text-destructive",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </motion.header>
    );
  }
);

ProfileHeader.displayName = 'ProfileHeader'; 