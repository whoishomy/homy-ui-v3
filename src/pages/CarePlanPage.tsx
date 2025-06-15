import React from 'react';
import { useTayfun } from '@/contexts/TayfunContext';
import { CarePlanBuilder } from '@/components/CarePlanBuilder';

export default function CarePlanPage() {
  const { carePlan, insights } = useTayfun();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Bakım Planı</h1>
      <div className="mt-6">
        <CarePlanBuilder defaultPlan={carePlan} insights={insights} />
      </div>
    </div>
  );
}
