export interface PatientMeta {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  primaryCondition: string;
  lastVisit: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export const tayfunMeta: PatientMeta = {
  id: 'TAYFUN-2025',
  name: 'Tayfun',
  age: 45,
  gender: 'male',
  primaryCondition: 'Diabetes Mellitus Type 2',
  lastVisit: '2025-06-10',
  riskLevel: 'high',
};
