export interface Recommendation {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  followUpIn: string;
}

export interface CarePlan {
  recommendations: Recommendation[];
}

export const tayfunCarePlan: CarePlan = {
  recommendations: [
    {
      title: 'Endokrinoloji Konsültasyonu',
      description:
        'Diyabet yönetiminin gözden geçirilmesi ve insülin dozunun ayarlanması için endokrinoloji görüşü.',
      priority: 'high',
      followUpIn: '1 hafta',
    },
    {
      title: 'Nefroloji Konsültasyonu',
      description: 'Böbrek fonksiyonlarının değerlendirilmesi ve tedavi planının oluşturulması.',
      priority: 'medium',
      followUpIn: '2 hafta',
    },
    {
      title: 'Günlük Glukoz Takibi',
      description: 'Günde 4 kez kan şekeri ölçümü yapılması ve kaydedilmesi.',
      priority: 'high',
      followUpIn: 'Günlük',
    },
    {
      title: 'Diyet Danışmanlığı',
      description: 'Diyabet ve böbrek dostu beslenme programının oluşturulması.',
      priority: 'medium',
      followUpIn: '2 hafta',
    },
  ],
};
