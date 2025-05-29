'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, FileText, TestTube, Calendar, Building2, TrendingUp, Download } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { LabResult, LabResultHistory } from '@/types/lab-results';
import { LabResultTrendChart } from './LabResultTrendChart';
import { ReferenceRange } from './ReferenceRange';
import { LabResultMetadata } from './LabResultMetadata';
import { InsightBubble } from './InsightBubble';
import { downloadLabResultPDF } from '@/modules/export/lab-report/utils/generateLabResultPDF';
import { useFilters } from '@/contexts/FilterContext';

export interface LabResultDetailViewProps {
  result?: LabResult;
  history?: LabResultHistory;
  isOpen: boolean;
  onCloseAction: () => void;
}

const DetailSection = ({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-gray-900 dark:text-white">
      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
      <h3 className="text-lg font-medium">{title}</h3>
    </div>
    <div className="pl-7">{children}</div>
  </div>
);

export const LabResultDetailView = ({
  result,
  history,
  isOpen,
  onCloseAction,
}: LabResultDetailViewProps) => {
  const { filters, setFilters } = useFilters();

  if (!result) return null;

  const { testName, value, unit, date, laboratory, category, orderedBy, reportedBy, notes } =
    result;

  const handleExport = async () => {
    try {
      await downloadLabResultPDF(result, { filters });
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      // TODO: Add toast notification for error
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCloseAction}>
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
                  <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-900 shadow-xl">
                    {/* Header */}
                    <div className="px-4 py-6 sm:px-6 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                            {testName}
                          </Dialog.Title>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {date && format(new Date(date), 'PPP', { locale: tr })}{' '}
                              {laboratory && `• ${laboratory}`}
                            </p>
                            {result.insights && result.insights.length > 0 && (
                              <InsightBubble insights={result.insights} position="bottom" />
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="relative rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={handleExport}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">PDF İndir</span>
                            <Download className="h-6 w-6" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            className="relative rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onClick={onCloseAction}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Kapat</span>
                            <X className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 px-4 py-6 sm:px-6 space-y-8">
                      {/* Current Value */}
                      <DetailSection icon={FileText} title="Sonuç">
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-semibold text-gray-900 dark:text-white">
                            {value}
                          </span>
                          <span className="text-lg text-gray-500 dark:text-gray-400">{unit}</span>
                        </div>
                        <ReferenceRange result={result} className="mt-4" />
                      </DetailSection>

                      {/* Trend Chart */}
                      {history && (
                        <DetailSection icon={TrendingUp} title="Trend Analizi">
                          <LabResultTrendChart
                            data={history.history.map((h: { date: string; value: number }) => ({
                              date: h.date,
                              value: h.value,
                            }))}
                          />
                        </DetailSection>
                      )}

                      {/* Test Details */}
                      <DetailSection icon={TestTube} title="Test Detayları">
                        <LabResultMetadata result={result} />
                      </DetailSection>

                      {/* Additional Info */}
                      <DetailSection icon={Building2} title="Laboratuvar Bilgileri">
                        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Laboratuvar
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                              {laboratory}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Kategori
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                              {category}
                            </dd>
                          </div>
                          {orderedBy && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                İsteyen Hekim
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {orderedBy}
                              </dd>
                            </div>
                          )}
                          {reportedBy && (
                            <div>
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Raporlayan
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {reportedBy}
                              </dd>
                            </div>
                          )}
                        </dl>
                      </DetailSection>

                      {/* Notes */}
                      {notes && (
                        <DetailSection icon={Calendar} title="Notlar">
                          <p className="text-sm text-gray-700 dark:text-gray-300">{notes}</p>
                        </DetailSection>
                      )}
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
