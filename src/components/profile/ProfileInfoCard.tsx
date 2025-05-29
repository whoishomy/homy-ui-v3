'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { Save, X, Edit2 } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import type { ToastVariant } from '@/types/toast';
import { cn } from '@/lib/utils/cn';
import type { UserProfile } from '@/store/user/userStore';

// Extend UserProfile type with additional fields for the form
interface ExtendedProfile extends UserProfile {
  phone?: string;
  address?: string;
}

const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(50, 'İsim en fazla 50 karakter olabilir'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  phone: z
    .string()
    .regex(/^(\+90|0)?\s*([0-9]{3})\s*([0-9]{3})\s*([0-9]{2})\s*([0-9]{2})$/, 'Geçerli bir telefon numarası giriniz')
    .optional(),
  address: z
    .string()
    .min(10, 'Adres en az 10 karakter olmalıdır')
    .max(200, 'Adres en fazla 200 karakter olabilir')
    .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileInfoCardProps {
  className?: string;
}

export const ProfileInfoCard = React.forwardRef<HTMLDivElement, ProfileInfoCardProps>(
  ({ className }, ref) => {
    const { user, updateUser } = useUser();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = React.useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
      reset,
    } = useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: (user as ExtendedProfile)?.phone || '',
        address: (user as ExtendedProfile)?.address || '',
      },
    });

    const onSubmit = async (data: ProfileFormData) => {
      try {
        await updateUser({
          ...user,
          fullName: data.fullName,
          email: data.email,
          ...(data.phone && { phone: data.phone }),
          ...(data.address && { address: data.address }),
        });
        setIsEditing(false);
        toast({
          title: 'Başarılı',
          message: 'Profil güncellendi',
          description: 'Bilgileriniz başarıyla kaydedildi.',
          variant: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'Hata',
          message: 'Profil güncellenemedi',
          description: 'Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.',
          variant: 'error',
          duration: 5000,
        });
      }
    };

    const handleCancel = () => {
      reset();
      setIsEditing(false);
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-lg border border-border/40 bg-card p-6',
          'shadow-sm transition-all duration-200',
          isEditing && 'ring-2 ring-ring ring-offset-2',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-card-foreground">
            Profil Bilgileri
          </h2>
          {!isEditing && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              aria-label="Profili düzenle"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-muted-foreground"
              >
                Ad Soyad
              </label>
              <input
                {...register('fullName')}
                id="fullName"
                type="text"
                disabled={!isEditing}
                className={cn(
                  'w-full rounded-md border border-input bg-background px-3 py-2',
                  'text-sm text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  errors.fullName && 'border-destructive focus:ring-destructive'
                )}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground"
              >
                E-posta
              </label>
              <input
                {...register('email')}
                id="email"
                type="email"
                disabled={!isEditing}
                className={cn(
                  'w-full rounded-md border border-input bg-background px-3 py-2',
                  'text-sm text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  errors.email && 'border-destructive focus:ring-destructive'
                )}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-muted-foreground"
              >
                Telefon
              </label>
              <input
                {...register('phone')}
                id="phone"
                type="tel"
                disabled={!isEditing}
                className={cn(
                  'w-full rounded-md border border-input bg-background px-3 py-2',
                  'text-sm text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  errors.phone && 'border-destructive focus:ring-destructive'
                )}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-muted-foreground"
              >
                Adres
              </label>
              <textarea
                {...register('address')}
                id="address"
                disabled={!isEditing}
                rows={3}
                className={cn(
                  'w-full rounded-md border border-input bg-background px-3 py-2',
                  'text-sm text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-ring',
                  'disabled:cursor-not-allowed disabled:opacity-50',
                  'resize-none',
                  errors.address && 'border-destructive focus:ring-destructive'
                )}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                İptal
              </Button>
              <Button
                type="submit"
                disabled={!isDirty}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Kaydet
              </Button>
            </div>
          )}
        </form>
      </motion.div>
    );
  }
);

ProfileInfoCard.displayName = 'ProfileInfoCard'; 