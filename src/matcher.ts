export class Matcher<T> {
  private _value: T;
  private _steps: any[] = [];
  
  constructor(value: T) {
    this._value = value;
  }

  with(
    value: any,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._steps.push({type: 'with', value, handler});

    return this;
  }

  withType<U>(
    value: new (...args: any[]) => U,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._steps.push({type: 'withType', value, handler});

    return this;
  }

  when(
    condition: (value: T) => Promise<boolean> | boolean,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._steps.push({type: 'when', condition, handler});

    return this;
  }

  extracting(
    extractor: (value: T) => Promise<any> | any
  ): Matcher<T> {
    this._steps.push({type: 'extracting', extractor});

    return this;
  }

  performing(
    matcher: (value1: any, value2: any) => Promise<boolean> | boolean
  ): Matcher<T> {
    this._steps.push({type: 'performing', matcher});

    return this;
  }

  otherwise(handler: () => Promise<any> | any): Matcher<T> {
    this._steps.push({type: 'otherwise', handler});
    
    return this;
  }

  async resolve() {
    let withMatcher = (value1: any, value2: any) => Promise.resolve(value1 === value2);

    for (let i = 0; i < this._steps.length; i++) {
      const step = this._steps[i];

      switch (step.type) {
        case 'with': {
          const result: boolean = await withMatcher(this._value, step.value);

          if (result === true) {
            return await step.handler();
          }
          break;
        }
        case 'withType': {
          if (this._value instanceof step.value) {
            return await step.handler();
          }
          break;
        }
        case 'when': {
          const result: boolean = await step.condition(this._value);
          
          if (result === true) {
            return await step.handler();
          }
          break;
        }
        case 'extracting': {
          this._value = await step.extractor(this._value);
          break;
        }
        case 'performing': {
          withMatcher = await step.matcher;
          break;
        }
        case 'otherwise': {
          return await step.handler();
        }
      }
    }

    return null;
  }
}
