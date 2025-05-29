export interface InsightData {
  id: string;
  type: 'observation' | 'recommendation' | 'alert' | 'trend';
  title: string;
  description: string;
  severity?: 'info' | 'low' | 'medium' | 'high';
  category: 'health' | 'lifestyle' | 'medication' | 'activity';
  source: {
    type: 'lab-result' | 'vital' | 'activity' | 'medication' | 'ai';
    id: string;
    timestamp: string;
  };
  metadata?: {
    confidence: number;
    model?: string;
    version?: string;
  };
  actions?: Array<{
    type: 'view' | 'schedule' | 'contact' | 'track';
    label: string;
    url?: string;
    data?: Record<string, unknown>;
  }>;
  relatedInsights?: string[]; // IDs of related insights
}
