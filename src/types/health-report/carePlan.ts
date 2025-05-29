export interface CarePlan {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
}
