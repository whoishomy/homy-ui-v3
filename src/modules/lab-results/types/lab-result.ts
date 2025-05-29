import { LabResult as BaseLabResult } from '@/types/lab-results';

interface DataPoint {
  date: string;
  value: number;
}

export interface LabResult extends BaseLabResult {
  trendData?: Array<DataPoint>;
}
