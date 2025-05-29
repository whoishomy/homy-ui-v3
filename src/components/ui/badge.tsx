import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'outline' | 'filled';
  className?: string;
}

export function Badge({ children, variant = 'filled', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variant === 'outline'
          ? 'border border-gray-200 text-gray-700'
          : 'bg-gray-100 text-gray-800',
        className
      )}
    >
      {children}
    </span>
  );
}
