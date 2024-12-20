export class Matcher<T> {
  private _value: T;
  private _conditions: any[] = [];
  private handled = false;
  private handler: any = (value: any) => null;
  
  constructor(value: T) {
    this._value = value;
  }

  with(
    value: any,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    if (!this.handled && this._value === value) {
      this.handled = true;
      
      this.handler = handler;
    }

    return this;
  }

  withType<U>(
    value: new (...args: any[]) => U,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    if (!this.handled && this._value instanceof value) {
      this.handled = true;
      
      this.handler = handler;
    }

    return this;
  }

  when(
    condition: (value: T) => Promise<boolean> | boolean,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._conditions.push({condition, handler});

    return this;
  }

  extrat(
    extractor: (value: T) => any
  ): Matcher<T> {
    this._value = extractor(this._value);

    return this;
  }

  otherwise(handler: () => Promise<any> | any): Matcher<T> {
    if (!this.handled) {
      if (this._conditions.length === 0) {
        this.handled = true;
      }

      this.handler = handler;
    }
    
    return this;
  }

  async resolve() {
    if (this._conditions.length > 0 && !this.handled) {
      for (let i = 0; i < this._conditions.length; i++) {
        const condition = this._conditions[i].condition;
        const handler = this._conditions[i].handler;

        const result: boolean = await condition(this._value);
        
        if (result === true) {
          return await handler(this._value);
        }
      }
    }

    return await this.handler(this._value);
  }
}
