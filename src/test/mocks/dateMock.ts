// Mock for date-fns/locale/tr
export const tr = {
  code: 'tr',
  formatLong: {
    date: 'd MMMM yyyy',
    time: 'HH:mm',
    dateTime: 'd MMMM yyyy HH:mm',
  },
  localize: {
    ordinalNumber: (n: number) => `${n}.`,
    month: () => '',
    day: () => '',
  },
  match: {
    ordinalNumber: () => false,
    era: () => false,
    quarter: () => false,
    month: () => false,
    day: () => false,
    dayPeriod: () => false,
  },
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 1,
  },
};

// Mock for date-fns format function
export const mockFormat = (date: Date | number, format: string, options?: { locale: any }) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
