export type VisionStatus = 'active' | 'inactive' | 'processing' | 'error';

export type VisionMode = 'realtime' | 'snapshot' | 'stream';

export type VisionCapability =
  | 'object_detection'
  | 'face_recognition'
  | 'text_recognition'
  | 'gesture_recognition'
  | 'scene_understanding';

export interface VisionConfig {
  mode: VisionMode;
  capabilities: VisionCapability[];
  resolution: {
    width: number;
    height: number;
  };
  fps?: number;
  confidenceThreshold: number;
}

export interface VisionResult<T = any> {
  timestamp: number;
  data: T;
  confidence: number;
  processingTime: number;
  source: string;
}

export interface VisionError {
  code: string;
  message: string;
  timestamp: number;
  source: string;
}

export interface VisionStats {
  framesProcessed: number;
  averageProcessingTime: number;
  detectionRate: number;
  errorRate: number;
  uptime: number;
}

export interface VisionContext {
  config: VisionConfig;
  status: VisionStatus;
  stats: VisionStats;
  lastError?: VisionError;
}

export interface DetectedObject {
  type: string;
  confidence: number;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  label: string;
  attributes?: Record<string, any>;
}
