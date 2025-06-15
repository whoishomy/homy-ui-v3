export class TimeoutMiddleware {
  constructor(private timeout: number = 1000) {}

  async handle<T>(operation: () => Promise<T>, context: any): Promise<T> {
    return operation();
  }
}
