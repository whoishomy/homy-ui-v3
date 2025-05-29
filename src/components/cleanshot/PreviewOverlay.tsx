'use client';

import { Eye, Download, Copy, RefreshCw, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface PreviewOverlayProps {
  onView?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  onRetake?: () => void;
  onDelete?: () => void;
  className?: string;
  darkMode?: boolean;
  viewport?: string;
  scale?: string;
}

export function PreviewOverlay({
  onView,
  onDownload,
  onCopy,
  onRetake,
  onDelete,
  className,
  darkMode,
  viewport,
  scale,
}: PreviewOverlayProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity',
        'flex flex-col items-center justify-center gap-4',
        className
      )}
    >
      {/* Info Badge */}
      <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/75 rounded-full text-xs text-white flex items-center gap-2">
        <span>{viewport}</span>
        <span>•</span>
        <span>{scale}</span>
        <span>•</span>
        <span>{darkMode ? 'Dark' : 'Light'}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {onView && (
          <button
            onClick={onView}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="View full size"
          >
            <Eye className="w-5 h-5 text-white" />
          </button>
        )}
        {onDownload && (
          <button
            onClick={onDownload}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Download screenshot"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        )}
        {onCopy && (
          <button
            onClick={onCopy}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Copy to clipboard"
          >
            <Copy className="w-5 h-5 text-white" />
          </button>
        )}
        {onRetake && (
          <button
            onClick={onRetake}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Retake screenshot"
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/50 hover:bg-red-500/75 rounded-full transition-colors"
            aria-label="Delete screenshot"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}
