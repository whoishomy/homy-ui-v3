"use client";

import { useState } from "react";
import { ThemeLanguageSelector } from "@/components/settings/ThemeLanguageSelector";
import { UserProfileForm } from "@/components/settings/UserProfileForm";

export default function SettingsPage() {
  const [currentLanguage, setCurrentLanguage] = useState("tr");

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
    // Additional language change logic can be added here
  };

  return (
    <main 
      className="min-h-screen p-4 sm:p-6 bg-white dark:bg-gray-900"
      aria-labelledby="settings-title"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 
            id="settings-title"
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Ayarlar
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Profil bilgilerinizi güncelleyin ve uygulama tercihlerinizi seçin.
          </p>
        </header>

        <div className="grid gap-8">
          <section 
            aria-labelledby="preferences-title"
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
          >
            <h2 
              id="preferences-title" 
              className="text-lg font-semibold text-gray-900 dark:text-white mb-4"
            >
              Uygulama Tercihleri
            </h2>
            <ThemeLanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </section>

          <section 
            aria-labelledby="profile-title"
            className="space-y-4"
          >
            <h2 
              id="profile-title"
              className="text-lg font-semibold text-gray-900 dark:text-white"
            >
              Profil Bilgileri
            </h2>
            <UserProfileForm />
          </section>
        </div>
      </div>
    </main>
  );
} 