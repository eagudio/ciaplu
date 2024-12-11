export class Matcher<T> {
  private _value: T;
  private handled = false;
  private handler: any = (value: any) => null;
  
  constructor(value: T) {
    this._value = value;
  }

  with(
    value: any,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    if (!this.handled && (typeof value === "function" ? this._value instanceof value : this._value === value)) {
      this.handled = true;
      
      this.handler = handler;
    }

    return this;
  }

  otherwise(handler: () => Promise<any> | any): Matcher<T> {
    if (!this.handled) {
      this.handled = true;

      this.handler = handler;
    }
    
    return this;
  }

  async resolve() {
    return await this.handler(this._value);
  }
}
