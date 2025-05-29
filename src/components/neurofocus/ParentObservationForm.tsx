'use client';

import React, { useState } from 'react';
import { toast } from '@/components/ui/Toast';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import confetti from 'canvas-confetti';

interface ObservationFormData {
  name: string;
  birthdate: string;
  strengths: string;
  challenges: string;
  diagnosis: string;
  focusHelpers: string;
  techHabits: string;
  parentNote: string;
}

const initialFormState: ObservationFormData = {
  name: '',
  birthdate: '',
  strengths: '',
  challenges: '',
  diagnosis: '',
  focusHelpers: '',
  techHabits: '',
  parentNote: '',
};

export default function ParentObservationForm() {
  const [form, setForm] = useState<ObservationFormData>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F46E5', '#10B981', '#F59E0B'],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: API route eklenince burası güncellenecek
      await fetch('/api/eren/observation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      toast.success('Gözlem formu başarıyla kaydedildi!');
      triggerConfetti();

      // Form reset
      setForm(initialFormState);
    } catch (error) {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg space-y-6"
      aria-labelledby="form-title"
    >
      <div className="text-center mb-8">
        <h2 id="form-title" className="text-2xl font-semibold text-gray-900 dark:text-white">
          👩‍👦 Eren için Veli Gözlem Formu
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Eren'in gelişimini birlikte takip edelim
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              İsim
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Eren"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Doğum Tarihi
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              value={form.birthdate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="strengths"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Güçlü Yönleri
          </label>
          <textarea
            id="strengths"
            name="strengths"
            value={form.strengths}
            onChange={handleChange}
            placeholder="Hayal gücü, mizah, müzik yeteneği..."
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="challenges"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Zorlandığı Alanlar
          </label>
          <textarea
            id="challenges"
            name="challenges"
            value={form.challenges}
            onChange={handleChange}
            placeholder="Odaklanma, yönerge takibi..."
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="diagnosis"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Tanı (Varsa)
          </label>
          <input
            id="diagnosis"
            name="diagnosis"
            type="text"
            value={form.diagnosis}
            onChange={handleChange}
            placeholder="Disleksi, DEHB..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="focusHelpers"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Odaklanmasına Yardımcı Olan Şeyler
          </label>
          <input
            id="focusHelpers"
            name="focusHelpers"
            type="text"
            value={form.focusHelpers}
            onChange={handleChange}
            placeholder="Müzik dinlemek, sessiz ortam..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="techHabits"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Teknoloji ile İlişkisi
          </label>
          <input
            id="techHabits"
            name="techHabits"
            type="text"
            value={form.techHabits}
            onChange={handleChange}
            placeholder="Tablet kullanımı, oyun tercihleri..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="parentNote"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Ebeveyn Gözlemi
          </label>
          <textarea
            id="parentNote"
            name="parentNote"
            value={form.parentNote}
            onChange={handleChange}
            placeholder="Çocuğunuzla ilgili eklemek istediğiniz diğer gözlemler..."
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}
