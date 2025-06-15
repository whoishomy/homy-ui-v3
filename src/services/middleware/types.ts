export interface MiddlewareContext {
  startTime: number;
  signal?: AbortSignal;
  [key: string]: any;
}
