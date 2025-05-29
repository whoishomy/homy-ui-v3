'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Info, CheckCircle, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface AIInsight {
  confidence: number;
  sourceData: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error' | 'insight';
  insight?: AIInsight;
}

interface Props {
  isOpen: boolean;
  onCloseAction: () => void;
  notifications: Notification[];
  onMarkAsReadAction: (ids: string[]) => void;
}

export const NotificationFeed = ({
  isOpen,
  onCloseAction,
  notifications,
  onMarkAsReadAction,
}: Props) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" data-testid="info-icon" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" data-testid="success-icon" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" data-testid="warning-icon" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" data-testid="error-icon" />;
      case 'insight':
        return <Sparkles className="w-5 h-5 text-purple-500" data-testid="insight-icon" />;
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={onCloseAction}
        aria-labelledby="notifications-title"
      >
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-auto bg-white dark:bg-gray-900 shadow-xl">
                    <div className="px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title
                          id="notifications-title"
                          className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                        >
                          Bildirimler
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
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

                    <div className="relative flex-1 px-4 sm:px-6">
                      {notifications.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Henüz bildirim bulunmuyor
                          </p>
                        </div>
                      ) : (
                        <div className="flow-root">
                          <ul role="list" className="-mb-8">
                            {notifications.map((notification, index) => (
                              <li key={notification.id}>
                                <div className="relative pb-8">
                                  {index < notifications.length - 1 && (
                                    <span
                                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                                      aria-hidden="true"
                                    />
                                  )}
                                  <div className="relative flex items-start space-x-3">
                                    <div className="relative">{getIcon(notification.type)}</div>
                                    <div className="min-w-0 flex-1">
                                      <div>
                                        <div className="text-sm">
                                          <span
                                            className={cn(
                                              'font-medium text-gray-900 dark:text-white',
                                              !notification.read && 'font-semibold'
                                            )}
                                          >
                                            {notification.title}
                                          </span>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                          {formatDate(notification.timestamp)}
                                        </p>
                                      </div>
                                      <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                        <p>{notification.message}</p>
                                        {notification.type === 'insight' &&
                                          notification.insight && (
                                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                              <p className="flex items-center gap-1">
                                                <span>
                                                  Güven: %
                                                  {Math.round(
                                                    notification.insight.confidence * 100
                                                  )}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                  Kaynak:{' '}
                                                  {notification.insight.sourceData.join(', ')}
                                                </span>
                                              </p>
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
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
