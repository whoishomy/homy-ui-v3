import React from 'react';
import { StatusBadge } from './StatusBadge';

export const StatusBadgeTestPage: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">StatusBadge Accessibility Test Page</h2>
        <p className="text-gray-600">
          This page displays all StatusBadge variants for accessibility testing.
        </p>
      </div>

      <div className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-lg font-medium">Non-Interactive States</h3>
          <div className="flex gap-4">
            <StatusBadge status="critical" label="Kritik" ariaLabel="Durum: Kritik" />
            <StatusBadge status="warning" label="Uyarı" ariaLabel="Durum: Uyarı" />
            <StatusBadge status="normal" label="Normal" ariaLabel="Durum: Normal" />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Interactive States</h3>
          <div className="flex gap-4">
            <StatusBadge
              status="critical"
              label="Kritik"
              ariaLabel="Durum: Kritik - Tıklanabilir"
              interactive
              onClick={() => {}}
            />
            <StatusBadge
              status="warning"
              label="Uyarı"
              ariaLabel="Durum: Uyarı - Tıklanabilir"
              interactive
              onClick={() => {}}
            />
            <StatusBadge
              status="normal"
              label="Normal"
              ariaLabel="Durum: Normal - Tıklanabilir"
              interactive
              onClick={() => {}}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-lg font-medium">Focus Management Test</h3>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
              Before
            </button>
            <StatusBadge
              status="critical"
              label="Kritik"
              ariaLabel="Durum: Kritik - Tıklanabilir"
              interactive
              onClick={() => {}}
            />
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">
              After
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatusBadgeTestPage;
