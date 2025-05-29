import { cn } from '@/utils/cn';
import { AlertOctagon, X } from 'lucide-react';
import { useState } from 'react';

interface Props {
  patientName: string;
  labType: string;
  value: number;
  unit?: string;
  onClose?: () => void;
  className?: string;
}

export const EmergencyAlertBanner = ({
  patientName,
  labType,
  value,
  unit,
  onClose,
  className,
}: Props) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-3 px-4 shadow-lg',
        className
      )}
      role="alert"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertOctagon className="w-6 h-6" />
          <div>
            <p className="font-semibold">
              Critical Alert: {patientName} - {labType}
            </p>
            <p className="text-sm">
              Value: {value}
              {unit && <span className="ml-1">{unit}</span>} - Immediate attention required
            </p>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-red-600 rounded-full transition-colors"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
