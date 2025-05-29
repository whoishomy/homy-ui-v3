"use client";

import { useState } from "react";

interface Props {
  initialData?: {
    name: string;
    email: string;
  };
  onSubmit?: (data: { name: string; email: string; password?: string }) => void;
}

export const UserProfileForm = ({ 
  initialData = { name: "Furkan", email: "furkan@example.com" },
  onSubmit
}: Props) => {
  const [name, setName] = useState(initialData.name);
  const [email, setEmail] = useState(initialData.email);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit?.({ name, email, password: password || undefined });
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
      aria-label="Kullanıcı Profili"
    >
      <div>
        <label 
          htmlFor="name" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Ad
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 p-2 rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          aria-required="true"
          required
        />
      </div>

      <div>
        <label 
          htmlFor="email" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 p-2 rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          aria-required="true"
          required
        />
      </div>

      <div>
        <label 
          htmlFor="password" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Yeni Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 p-2 rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          aria-describedby="password-hint"
          minLength={6}
        />
        <p 
          id="password-hint" 
          className="mt-1 text-xs text-gray-500 dark:text-gray-400"
        >
          Boş bırakırsanız şifreniz değişmez
        </p>
      </div>

      <button
        type="submit"
        className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Güncelleniyor..." : "Güncelle"}
      </button>
    </form>
  );
}; 