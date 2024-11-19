export class ExceptionMatcher {
  private exception: any;
  private handled = false;

  constructor(exception: any) {
    this.exception = exception;
  }

  static match(exception: any) {
    return new ExceptionMatcher(exception);
  }

  with<T extends Error>(
    errorType: new (...args: any[]) => T,
    handler: (ex: T) => void
  ) {
    if (!this.handled && this.exception instanceof errorType) {
      this.handled = true;
      handler(this.exception);
    }
    return this;
  }

  otherwise(handler: (ex: any) => void) {
    if (!this.handled) {
      handler(this.exception);
    }
  }
}
