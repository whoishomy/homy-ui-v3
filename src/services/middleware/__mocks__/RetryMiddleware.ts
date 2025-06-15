export class RetryMiddleware {
  constructor(private maxRetries: number = 2) {}

  async handle<T>(operation: () => Promise<T>, context: any): Promise<T> {
    return operation();
  }
}
