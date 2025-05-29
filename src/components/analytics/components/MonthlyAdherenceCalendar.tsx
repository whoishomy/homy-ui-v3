import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { tr } from 'date-fns/locale';
import { HealthCategory } from '@/types/analytics';

interface MonthlyAdherenceCalendarProps {
  data: {
    overall: number;
    byCategory: Record<keyof typeof HealthCategory, number>;
  } | null;
}

const WEEKDAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

export const MonthlyAdherenceCalendar: React.FC<MonthlyAdherenceCalendarProps> = ({
  data,
}) => {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getAdherenceColor = (adherence: number) => {
    if (adherence >= 90) return 'bg-green-500';
    if (adherence >= 70) return 'bg-green-400';
    if (adherence >= 50) return 'bg-yellow-400';
    if (adherence >= 30) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <div className="space-y-4">
      {/* Ay Başlığı */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(today, 'MMMM yyyy', { locale: tr })}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Genel Uyum:</span>
          <span className="text-sm font-medium text-gray-900">
            {data?.overall ?? 0}%
          </span>
        </div>
      </div>

      {/* Takvim Grid */}
      <div className="border rounded-lg overflow-hidden">
        {/* Haftanın Günleri */}
        <div className="grid grid-cols-7 bg-gray-50 border-b">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Günler */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day, index) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const isToday = format(today, 'yyyy-MM-dd') === dayStr;
            const isPast = day < today;

            return (
              <div
                key={dayStr}
                className={`bg-white p-2 min-h-[80px] ${
                  isToday ? 'ring-2 ring-green-500 ring-inset' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm ${
                      isToday
                        ? 'font-bold text-green-600'
                        : 'font-medium text-gray-900'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {isPast && (
                    <div
                      className={`w-2 h-2 rounded-full ${getAdherenceColor(
                        Math.random() * 100
                      )}`}
                    />
                  )}
                </div>
                {isPast && (
                  <div className="mt-1">
                    <div className="text-xs text-gray-500">
                      {Math.floor(Math.random() * 5) + 1} görev
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Kategori Bazlı Uyum */}
      {data?.byCategory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {Object.entries(data.byCategory).map(([category, adherence]) => (
            <div
              key={category}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-700">
                {category}
              </span>
              <span
                className={`text-sm font-medium ${
                  adherence >= 70 ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {adherence}%
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Renk Açıklamaları */}
      <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1" />
          <span>90%+</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-400 mr-1" />
          <span>70-89%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1" />
          <span>50-69%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-400 mr-1" />
          <span>30-49%</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-400 mr-1" />
          <span>0-29%</span>
        </div>
      </div>
    </div>
  );
}; 