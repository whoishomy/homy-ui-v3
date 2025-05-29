export interface HealthMetric {
  id: string;
  name: string;
  type: 'number' | 'boolean' | 'string' | 'select' | 'range';
  unit?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: string | number | boolean;
  targetValue?: string | number | boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
  description?: string;
}
