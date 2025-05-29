'use client';

import { Fragment } from 'react';
import { Dialog, Transition, Switch } from '@headlessui/react';
import { X, Moon, Sun, Bell, Globe2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  notificationsEnabled: boolean;
}

interface Props {
  isOpen: boolean;
  onCloseAction: () => void;
  settings: Settings;
  onSettingsChangeAction: (settings: Settings) => void;
  availableLanguages: { code: string; name: string }[];
  className?: string;
}

export const SettingsDrawer = ({
  isOpen,
  onCloseAction,
  settings,
  onSettingsChangeAction,
  availableLanguages,
  className,
}: Props) => {
  const handleThemeChange = (theme: Settings['theme']) => {
    onSettingsChangeAction({ ...settings, theme });
  };

  const handleLanguageChange = (language: string) => {
    onSettingsChangeAction({ ...settings, language });
  };

  const handleNotificationsChange = (enabled: boolean) => {
    onSettingsChangeAction({ ...settings, notificationsEnabled: enabled });
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className={cn('relative z-50', className)}
        onClose={onCloseAction}
        aria-labelledby="settings-title"
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
                          id="settings-title"
                          className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                        >
                          Ayarlar
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
                      {/* Theme Settings */}
                      <div className="py-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          {settings.theme === 'dark' ? (
                            <Moon className="w-4 h-4" />
                          ) : (
                            <Sun className="w-4 h-4" />
                          )}
                          Tema
                        </h3>
                        <div className="mt-4 space-y-4">
                          {(['light', 'dark', 'system'] as const).map((theme) => (
                            <label key={theme} className="flex items-center">
                              <input
                                type="radio"
                                className="form-radio text-green-500 focus:ring-green-500"
                                name="theme"
                                value={theme}
                                checked={settings.theme === theme}
                                onChange={() => handleThemeChange(theme)}
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {theme === 'system'
                                  ? 'Sistem'
                                  : theme === 'light'
                                  ? 'Açık'
                                  : 'Koyu'}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Language Settings */}
                      <div className="py-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <Globe2 className="w-4 h-4" />
                          Dil
                        </h3>
                        <div className="mt-4">
                          <select
                            value={settings.language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 
                                     py-2 pl-3 pr-10 text-base focus:border-green-500 focus:outline-none 
                                     focus:ring-green-500 dark:bg-gray-800 dark:text-white sm:text-sm"
                          >
                            {availableLanguages.map((lang) => (
                              <option key={lang.code} value={lang.code}>
                                {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="py-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-gray-900 dark:text-white" />
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                              Bildirimler
                            </h3>
                          </div>
                          <Switch
                            checked={settings.notificationsEnabled}
                            onChange={handleNotificationsChange}
                            className={cn(
                              settings.notificationsEnabled
                                ? 'bg-green-500'
                                : 'bg-gray-200 dark:bg-gray-700',
                              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                            )}
                          >
                            <span className="sr-only">
                              Bildirimleri {settings.notificationsEnabled ? 'kapat' : 'aç'}
                            </span>
                            <span
                              aria-hidden="true"
                              className={cn(
                                settings.notificationsEnabled ? 'translate-x-5' : 'translate-x-0',
                                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                              )}
                            />
                          </Switch>
                        </div>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Sistem bildirimlerini almak için bu ayarı aktif edin.
                        </p>
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
