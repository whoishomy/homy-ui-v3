import { cn } from '@/utils/cn';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface Props {
  className?: string;
  onContactClick?: () => void;
}

export const EmergencyFooterMessage = ({ className, onContactClick }: Props) => {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 bg-gradient-to-t from-red-500/10 to-transparent',
        'py-4 px-6',
        className
      )}
    >
      <div className="container mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
            <div className="space-y-2 flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                Important Healthcare Notice
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This test result requires immediate medical attention. Please contact your
                healthcare provider as soon as possible for further evaluation and guidance.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={onContactClick}
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  Contact Healthcare Provider
                  <ExternalLink className="w-4 h-4" />
                </button>
                <a
                  href="/emergency-resources"
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  View Emergency Resources
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
