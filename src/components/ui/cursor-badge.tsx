import { cn } from '@/utils/cn';
import { Brain, Cog, Play } from 'lucide-react';

export type CursorBadgeVariant = 'think' | 'make' | 'do';

interface CursorBadgeProps {
  variant: CursorBadgeVariant;
  className?: string;
}

const variantConfig = {
  think: {
    icon: Brain,
    baseColor: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-900/30',
    label: 'Thinking',
  },
  make: {
    icon: Cog,
    baseColor: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-900/30',
    label: 'Making',
  },
  do: {
    icon: Play,
    baseColor: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-900/30',
    label: 'Doing',
  },
};

export const CursorBadge = ({ variant, className }: CursorBadgeProps) => {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        'border transition-colors duration-200',
        config.baseColor,
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
};
