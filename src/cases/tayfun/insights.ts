export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  date: Date;
}

export const tayfunInsights: Insight[] = [
  {
    id: 'diabetes-1',
    title: 'Diyabet Kontrolü',
    description:
      'HbA1c ve açlık kan şekeri değerleri hedef aralığın üzerinde seyrediyor. Diyabet yönetiminin gözden geçirilmesi gerekli.',
    severity: 'high',
    category: 'endocrine',
    date: new Date(),
  },
  {
    id: 'kidney-1',
    title: 'Böbrek Fonksiyonları',
    description:
      'Kreatinin değeri yüksek seyrediyor. Böbrek fonksiyonlarının yakından takibi önerilir.',
    severity: 'medium',
    category: 'renal',
    date: new Date(),
  },
  {
    id: 'metabolic-1',
    title: 'Metabolik Risk',
    description:
      'Mevcut laboratuvar değerleri metabolik sendrom riski gösteriyor. Yaşam tarzı değişiklikleri önerilir.',
    severity: 'medium',
    category: 'metabolic',
    date: new Date(),
  },
];
