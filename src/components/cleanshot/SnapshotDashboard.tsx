'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ViewToggle } from './ViewToggle';
import { ScreenshotTooltip } from './ScreenshotTooltip';
import { PreviewOverlay } from './PreviewOverlay';

interface Screenshot {
  path: string;
  viewport: string;
  scale: string;
  createdAt: string;
  component: string;
  darkMode: boolean;
  status?: string;
}

interface ComponentScreenshots {
  variants: {
    [key: string]: Screenshot;
  };
}

interface ScreenshotData {
  components: {
    [key: string]: ComponentScreenshots;
  };
}

interface SnapshotDashboardProps {
  data: ScreenshotData;
  className?: string;
}

export function SnapshotDashboard({ data, className }: SnapshotDashboardProps) {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'complete'>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const components = Object.entries(data.components).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  const filteredComponents = components.filter((component) => {
    if (filter === 'all') return true;
    const hasPendingVariants = Object.values(component.variants).some(
      (variant) => variant.status === 'pending'
    );
    return filter === 'pending' ? hasPendingVariants : !hasPendingVariants;
  });

  const handleAddVariant = (componentId: string) => {
    // This would be implemented to trigger the CleanShot capture process
    console.log(`Add variant for ${componentId}`);
  };

  const getImagePath = (path: string) => {
    if (path.startsWith('http')) {
      return path;
    }
    return path.startsWith('/') ? path : `/${path}`;
  };

  const handleViewImage = (path: string) => {
    setPreviewImage(path);
    // Open in new tab for now, later we can add a modal
    window.open(getImagePath(path), '_blank');
  };

  const handleDownloadImage = async (path: string) => {
    try {
      const response = await fetch(getImagePath(path));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'screenshot.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const handleCopyImage = async (path: string) => {
    try {
      const response = await fetch(getImagePath(path));
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
    } catch (error) {
      console.error('Failed to copy image:', error);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            CleanShot Dashboard
          </h2>
          <ViewToggle view={view} onChange={setView} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-3 py-1 text-sm rounded-md',
              filter === 'all'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={cn(
              'px-3 py-1 text-sm rounded-md',
              filter === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            )}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('complete')}
            className={cn(
              'px-3 py-1 text-sm rounded-md',
              filter === 'complete'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            )}
          >
            Complete
          </button>
        </div>
      </div>

      <div
        className={cn({
          'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6': view === 'grid',
          'space-y-4': view === 'list',
        })}
      >
        {filteredComponents.map((component) => (
          <div
            key={component.id}
            className={cn(
              'border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden',
              {
                'flex items-start': view === 'list',
              }
            )}
          >
            <div
              className={cn('p-4 bg-gray-50 dark:bg-gray-900', {
                'flex-shrink-0 w-64': view === 'list',
              })}
            >
              <Link
                href={`/components/${component.id}`}
                className="inline-block text-lg font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                {component.id}
              </Link>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(component.variants).map(([variantKey, variant]) => (
                  <span
                    key={variantKey}
                    className={cn(
                      'px-2 py-1 text-xs rounded-full',
                      variant.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    )}
                  >
                    {variantKey}
                  </span>
                ))}
                <button
                  onClick={() => handleAddVariant(component.id)}
                  className="px-2 py-1 text-xs rounded-full border border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className={cn('p-4 space-y-4', { 'flex-grow': view === 'list' })}>
              <div
                className={cn({
                  'grid grid-cols-2 gap-4': view === 'list',
                })}
              >
                {Object.entries(component.variants).map(([variantKey, variant]) => (
                  <div key={variantKey} className="group relative space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {variantKey}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          variant.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
                        )}
                      >
                        {variant.darkMode ? 'Dark' : 'Light'}
                      </span>
                    </div>
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                      {variant.status !== 'pending' ? (
                        <>
                          <Image
                            src={getImagePath(variant.path)}
                            alt={`${component.id} ${variantKey} screenshot`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-contain transition-opacity opacity-0 duration-300"
                            onLoadingComplete={(img) => {
                              img.classList.remove('opacity-0');
                            }}
                            loading="lazy"
                            quality={90}
                          />
                          <PreviewOverlay
                            darkMode={variant.darkMode}
                            viewport={variant.viewport}
                            scale={variant.scale}
                            onView={() => handleViewImage(variant.path)}
                            onDownload={() => handleDownloadImage(variant.path)}
                            onCopy={() => handleCopyImage(variant.path)}
                            onRetake={() => handleAddVariant(component.id)}
                          />
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Pending...
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{variant.viewport}</span>
                      <span>{variant.scale}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
