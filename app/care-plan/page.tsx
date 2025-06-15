'use client';

import { useTayfun } from '@/contexts/TayfunContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CarePlanPage() {
  const router = useRouter();
  const { isLoggedIn, meta, labResults } = useTayfun();

  useEffect(() => {
    // Temporarily disabled for demo
    // if (!isLoggedIn) {
    //   router.push('/login');
    // }
  }, [isLoggedIn, router]);

  // Determine recommendations based on lab results
  const getRecommendations = () => {
    const recommendations = [];

    // Check glucose levels
    const glucose = labResults.find((r) => r.name === 'Glukoz');
    if (glucose && glucose.status === 'critical') {
      recommendations.push({
        title: 'Kan Şekeri Kontrolü',
        description:
          'Kan şekeri değerleriniz kritik seviyede yüksek. Günlük kan şekeri takibi yapılması ve insülin dozunun ayarlanması gerekebilir.',
        priority: 'high',
      });
    }

    // Check HbA1c levels
    const hba1c = labResults.find((r) => r.name === 'HbA1c');
    if (hba1c && hba1c.status === 'critical') {
      recommendations.push({
        title: 'Uzun Dönem Şeker Kontrolü',
        description:
          'HbA1c değeriniz hedef aralığın üzerinde. Beslenme planınızın ve ilaç tedavinizin gözden geçirilmesi önerilir.',
        priority: 'high',
      });
    }

    // Check creatinine levels
    const creatinine = labResults.find((r) => r.name === 'Kreatinin');
    if (creatinine && creatinine.status === 'warning') {
      recommendations.push({
        title: 'Böbrek Fonksiyon Takibi',
        description:
          'Kreatinin değerleriniz yüksek seyrediyor. Böbrek fonksiyonlarınızın yakından takip edilmesi önerilir.',
        priority: 'medium',
      });
    }

    // General recommendations
    recommendations.push({
      title: 'Düzenli Egzersiz',
      description: 'Günde en az 30 dakika orta şiddette egzersiz yapılması önerilir.',
      priority: 'normal',
    });

    recommendations.push({
      title: 'Beslenme Takibi',
      description: 'Diyetisyen kontrolünde beslenme programınıza uyum gösterilmesi önemlidir.',
      priority: 'normal',
    });

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Bakım Planı</h1>

      {/* Patient Meta Information */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Hasta Bilgileri</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600">İsim</p>
            <p className="font-medium">{meta.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Yaş</p>
            <p className="font-medium">{meta.age}</p>
          </div>
          <div>
            <p className="text-gray-600">Risk Seviyesi</p>
            <p className="font-medium text-red-600">{meta.riskLevel}</p>
          </div>
        </div>
      </div>

      {/* Care Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              rec.priority === 'high'
                ? 'border-red-200 bg-red-50'
                : rec.priority === 'medium'
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-green-200 bg-green-50'
            }`}
          >
            <h3
              className={`font-semibold mb-2 ${
                rec.priority === 'high'
                  ? 'text-red-700'
                  : rec.priority === 'medium'
                  ? 'text-yellow-700'
                  : 'text-green-700'
              }`}
            >
              {rec.title}
            </h3>
            <p className="text-gray-600">{rec.description}</p>
          </div>
        ))}
      </div>

      {/* Next Steps */}
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-blue-700 mb-2">Sonraki Adımlar</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-600">
          <li>2 hafta sonra kontrol kan tahlilleri</li>
          <li>Diyetisyen randevusu</li>
          <li>Nefroloji konsültasyonu</li>
          <li>Günlük kan şekeri takip çizelgesinin doldurulması</li>
        </ul>
      </div>
    </main>
  );
}
