'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { DataTrendChart } from '@/components/charts/DataTrendChart';
import { cn } from '@/utils/cn';
import { useTrademarkStyle } from '../../hooks/useTrademarkStyle';
import { getTrademarkName } from '../../utils/trademark';
import type { LabResult } from './LabResultsPanel';

interface Props {
  result?: LabResult;
  isOpen: boolean;
  onClose: () => void;
}

export const ResultDetailDrawer = ({ result, isOpen, onClose }: Props) => {
  const containerRef = useTrademarkStyle<HTMLDivElement>();

  if (!result) return null;

  const significanceColor = result.clinicalContext?.significance?.includes('Critical')
    ? 'text-red-500'
    : result.clinicalContext?.significance?.includes('Significant')
      ? 'text-amber-500'
      : result.clinicalContext?.significance?.includes('Abnormal')
        ? 'text-yellow-500'
        : 'text-green-500';

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose} initialFocus={containerRef}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <div
                    ref={containerRef}
                    className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl"
                  >
                    <div className="px-4 sm:px-6 py-6 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                          {getTrademarkName(result.title)}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-white dark:bg-gray-900 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={onClose}
                          >
                            <span className="sr-only">Kapat</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="relative flex-1 px-4 sm:px-6">
                      <div className="py-6">
                        <div className="space-y-6">
                          <section aria-labelledby="trend-title">
                            <h3 id="trend-title" className="sr-only">
                              Trend Grafiği
                            </h3>
                            <div className="h-64">
                              <DataTrendChart
                                title={result.title}
                                data={result.data}
                                valueUnit={result.unit}
                                valueLabel={result.title}
                                referenceRange={result.referenceRange}
                              />
                            </div>
                          </section>

                          <section aria-labelledby="details-title">
                            <h3
                              id="details-title"
                              className="text-sm font-medium text-gray-900 dark:text-white mb-3"
                            >
                              Detaylar
                            </h3>
                            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  Son Değer
                                </dt>
                                <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                  {result.data[result.data.length - 1].value} {result.unit}
                                </dd>
                              </div>
                              {result.referenceRange && (
                                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
                                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Referans Aralığı
                                  </dt>
                                  <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                    {result.referenceRange.min} - {result.referenceRange.max}{' '}
                                    {result.unit}
                                  </dd>
                                </div>
                              )}
                              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
                                <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  Trend
                                </dt>
                                <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                                  {result.trend === 'up'
                                    ? 'Yükselen'
                                    : result.trend === 'down'
                                      ? 'Düşen'
                                      : 'Stabil'}
                                </dd>
                              </div>
                              {result.clinicalContext?.significance && (
                                <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
                                  <dt className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Klinik Önem
                                  </dt>
                                  <dd
                                    className={cn('mt-1 text-sm font-semibold', significanceColor)}
                                  >
                                    {result.clinicalContext.significance}
                                  </dd>
                                </div>
                              )}
                            </dl>
                          </section>

                          {result.clinicalContext?.relatedTests &&
                            result.clinicalContext.relatedTests.length > 0 && (
                              <section aria-labelledby="related-tests-title">
                                <h3
                                  id="related-tests-title"
                                  className="text-sm font-medium text-gray-900 dark:text-white mb-3"
                                >
                                  İlişkili Testler
                                </h3>
                                <ul className="space-y-2">
                                  {result.clinicalContext.relatedTests.map((test, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-600 dark:text-gray-300"
                                    >
                                      {test}
                                    </li>
                                  ))}
                                </ul>
                              </section>
                            )}

                          {result.clinicalContext?.doctorNotes && (
                            <section aria-labelledby="doctor-notes-title">
                              <h3
                                id="doctor-notes-title"
                                className="text-sm font-medium text-gray-900 dark:text-white mb-3"
                              >
                                Doktor Notları
                              </h3>
                              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg">
                                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                  {result.clinicalContext.doctorNotes}
                                </p>
                              </div>
                            </section>
                          )}

                          {result.insights && result.insights.length > 0 && (
                            <section aria-labelledby="insights-title">
                              <h3
                                id="insights-title"
                                className="text-sm font-medium text-gray-900 dark:text-white mb-3"
                              >
                                AI Insights
                              </h3>
                              <div className="space-y-3">
                                {result.insights.map((insight, index) => (
                                  <div
                                    key={index}
                                    className="bg-gray-50 dark:bg-gray-800 px-4 py-3 rounded-lg"
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {insight.type.charAt(0).toUpperCase() +
                                          insight.type.slice(1)}
                                      </span>
                                      <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {Math.round(insight.confidence * 100)}% güven
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      {insight.message}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                      Kaynak: {insight.source}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </section>
                          )}

                          {result.recommendations && result.recommendations.length > 0 && (
                            <section aria-labelledby="recommendations-title">
                              <h3
                                id="recommendations-title"
                                className="text-sm font-medium text-gray-900 dark:text-white mb-3"
                              >
                                Öneriler
                              </h3>
                              <ul className="space-y-2">
                                {result.recommendations.map((recommendation, index) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                                  >
                                    <span className="select-none">•</span>
                                    <span>{recommendation}</span>
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
