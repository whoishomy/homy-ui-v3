export class FallbackMiddleware {
  constructor(private timeout: number = 1000) {}

  async execute<T>(operation: () => Promise<T>, context: any): Promise<T> {
    return operation();
  }
}
