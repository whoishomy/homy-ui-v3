'use client';

import { useTayfun } from '@/contexts/TayfunContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LabResultsPage() {
  const router = useRouter();
  const { isLoggedIn, labResults, meta } = useTayfun();

  useEffect(() => {
    // Temporarily disabled for demo
    // if (!isLoggedIn) {
    //   router.push('/login');
    // }
  }, [isLoggedIn, router]);

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tayfun'un Laboratuvar Sonuçları</h1>

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

      {/* Lab Results Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Test
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sonuç
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Birim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referans Aralığı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {labResults.map((result, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.unit}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.referenceRange}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      result.status === 'critical'
                        ? 'bg-red-100 text-red-800'
                        : result.status === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {result.status === 'critical'
                      ? 'Kritik'
                      : result.status === 'warning'
                      ? 'Uyarı'
                      : 'Normal'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
