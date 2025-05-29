'use client';

import { Fragment } from 'react';
import { Disclosure, Transition } from '@headlessui/react';
import { ChevronDown, TestTube, Clock, Beaker, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { cn } from '@/utils/cn';
import { LabResult } from '@/types/lab-results';

interface LabResultMetadataProps {
  result: LabResult;
  className?: string;
  expandByDefault?: boolean;
}

const MetadataRow = ({ label, value }: { label: string; value: string | null }) => {
  if (!value) return null;
  return (
    <div className="py-2">
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 dark:text-white">{value}</dd>
    </div>
  );
};

export const LabResultMetadata = ({
  result,
  className,
  expandByDefault = false,
}: LabResultMetadataProps) => {
  const {
    methodology,
    sampleCollectedAt,
    sampleProcessedAt,
    resultAvailableAt,
    verifiedAt,
    verifiedBy,
  } = result;

  const formatDateTime = (dateString: string) =>
    format(new Date(dateString), 'PPpp', { locale: tr });

  return (
    <div className={cn('space-y-4', className)}>
      {/* Methodology Section */}
      {methodology && (
        <Disclosure defaultOpen={expandByDefault}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <TestTube className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Test Metodolojisi
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform',
                    open && 'transform rotate-180'
                  )}
                />
              </Disclosure.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-1"
              >
                <Disclosure.Panel className="px-4 pt-2 pb-3">
                  <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <MetadataRow label="Yöntem" value={methodology.name} />
                    <MetadataRow label="Cihaz" value={methodology.device} />
                    <MetadataRow label="Numune Türü" value={methodology.sampleType} />
                    <MetadataRow label="İşlem Süresi" value={methodology.processingTime} />
                    {methodology.description && (
                      <div className="col-span-full">
                        <MetadataRow label="Açıklama" value={methodology.description} />
                      </div>
                    )}
                    {methodology.limitations && methodology.limitations.length > 0 && (
                      <div className="col-span-full">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Kısıtlamalar
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                          <ul className="list-disc pl-4 space-y-1">
                            {methodology.limitations.map((limitation, index) => (
                              <li key={index}>{limitation}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    )}
                  </dl>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      )}

      {/* Timeline Section */}
      {(sampleCollectedAt || sampleProcessedAt || resultAvailableAt || verifiedAt) && (
        <Disclosure defaultOpen={expandByDefault}>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    Test Zaman Çizelgesi
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform',
                    open && 'transform rotate-180'
                  )}
                />
              </Disclosure.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 -translate-y-1"
              >
                <Disclosure.Panel className="px-4 pt-2 pb-3">
                  <dl className="space-y-2">
                    {sampleCollectedAt && (
                      <MetadataRow
                        label="Numune Alım Zamanı"
                        value={formatDateTime(sampleCollectedAt)}
                      />
                    )}
                    {sampleProcessedAt && (
                      <MetadataRow
                        label="İşlem Başlangıç Zamanı"
                        value={formatDateTime(sampleProcessedAt)}
                      />
                    )}
                    {resultAvailableAt && (
                      <MetadataRow
                        label="Sonuç Hazır Zamanı"
                        value={formatDateTime(resultAvailableAt)}
                      />
                    )}
                    {verifiedAt && (
                      <MetadataRow
                        label="Onay Zamanı"
                        value={`${formatDateTime(verifiedAt)}${
                          verifiedBy ? ` • ${verifiedBy}` : ''
                        }`}
                      />
                    )}
                  </dl>
                </Disclosure.Panel>
              </Transition>
            </>
          )}
        </Disclosure>
      )}
    </div>
  );
};
