import React from 'react';
import { useCarePlanStore } from '@/store/carePlanStore';
import { CarePlan } from '@/types/carePlan';
import { BasicInfoStep } from './steps/BasicInfoStep';
import { MedicationStep } from './steps/MedicationStep';
import { Toast } from '@/components/ui/Toast';
import { HealthMetricStep } from './steps/HealthMetricStep';
import { ReviewStep } from './steps/ReviewStep';

interface CarePlanBuilderProps {
  onComplete?: (plan: CarePlan) => void;
  onCancel?: () => void;
  initialStep?: number;
}

type BuilderStep = {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
};

const BUILDER_STEPS: BuilderStep[] = [
  {
    id: 'basics',
    title: 'Temel Bilgiler',
    description: 'Bakım planının temel bilgilerini girin',
    component: BasicInfoStep,
  },
  {
    id: 'medications',
    title: 'İlaçlar',
    description: 'İlaç tedavisi planlaması',
    component: MedicationStep,
  },
  {
    id: 'appointments',
    title: 'Randevular',
    description: 'Randevu ve kontrol planlaması',
    component: () => <div>Randevu Planlaması</div>, // Bu bileşeni daha sonra oluşturacağız
  },
  {
    id: 'goals',
    title: 'Hedefler',
    description: 'Sağlık hedeflerini belirleyin',
    component: () => <div>Hedef Belirleme</div>, // Bu bileşeni daha sonra oluşturacağız
  },
  {
    id: 'metrics',
    title: 'Metrikler',
    description: 'İzlenecek sağlık metriklerini seçin',
    component: HealthMetricStep,
  },
  {
    id: 'review',
    title: 'Gözden Geçirme',
    description: 'Bakım planını gözden geçirin ve tamamlayın',
    component: ReviewStep,
  },
];

export const CarePlanBuilder: React.FC<CarePlanBuilderProps> = ({
  onComplete,
  onCancel,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = React.useState(initialStep);
  const [draftPlan, setDraftPlan] = React.useState<Partial<CarePlan>>({
    status: 'draft',
    medications: [],
    appointments: [],
    goals: [],
    metrics: [],
  });

  const { createCarePlan } = useCarePlanStore();

  const currentStepData = BUILDER_STEPS[currentStep];
  const StepComponent = currentStepData.component;

  const handleNext = () => {
    if (currentStep < BUILDER_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepDataUpdate = (stepData: Partial<CarePlan>) => {
    setDraftPlan((prev) => ({
      ...prev,
      ...stepData,
    }));
  };

  const handleComplete = async () => {
    try {
      // Burada draftPlan'ı CarePlan tipine dönüştürüyoruz
      const completePlan = await createCarePlan(draftPlan as Omit<CarePlan, 'id' | 'createdAt' | 'updatedAt'>);
      onComplete?.(completePlan);
    } catch (error) {
      console.error('Bakım planı oluşturulurken hata:', error);
      // Hata yönetimini daha sonra ekleyeceğiz
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Toast */}
      <Toast />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Bakım Planı Oluşturucu</h1>
          <p className="mt-1 text-sm text-gray-500">{currentStepData.description}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <div className="flex justify-between">
            {BUILDER_STEPS.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center ${
                  index < BUILDER_STEPS.length - 1 ? 'flex-1' : ''
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index <= currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div
                  className={`ml-2 text-sm ${
                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </div>
                {index < BUILDER_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <StepComponent
          data={draftPlan}
          onUpdate={handleStepDataUpdate}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-7xl mx-auto flex justify-between">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            İptal
          </button>
          <div className="flex space-x-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Geri
            </button>
            {currentStep === BUILDER_STEPS.length - 1 ? (
              <button
                onClick={handleComplete}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Planı Tamamla
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Devam Et
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 