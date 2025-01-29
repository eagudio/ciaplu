export class Matcher<T> {
  private _value: T;
  private _steps: any[] = [];
  
  constructor(value: T) {
    this._value = value;
  }

  matchingFirst(): Matcher<T> {
    this._steps.push({type: 'matchingFirst', value: true});
    
    return this;
  }

  matchingAll(): Matcher<T> {
    this._steps.push({type: 'matchingFirst', value: false});

    return this;
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

  returningFirst(): Matcher<T> {
    this._steps.push({type: 'returningFirst', value: true});
    
    return this;
  }

  returningAll(): Matcher<T> {
    this._steps.push({type: 'returningFirst', value: false});
    
    return this;
  }

  async resolve() {
    let matchFirst: boolean = true;
    let returnFirst: boolean = true;
    let withMatcher = (value1: any, value2: any) => Promise.resolve(value1 === value2);
    //let result: any = null;
    let results: any[] = [];
    let matchFound = false;

    for (let i = 0; i < this._steps.length; i++) {
      const step = this._steps[i];

      switch (step.type) {
        case 'matchingFirst': {
          matchFirst = step.value;
          break;
        }
        case 'with': {
          const matched: boolean = await withMatcher(this._value, step.value);

          if (matched === true) {
            matchFound = true;

            if (matchFirst) {
              return await step.handler();
            }

            const result = await step.handler();

            results.push(result);
          }
          break;
        }
        case 'withType': {
          if (this._value instanceof step.value) {
            matchFound = true;

            if (matchFirst) {
              return await step.handler();
            }

            const result = await step.handler();

            results.push(result);
          }
          break;
        }
        case 'when': {
          const matched: boolean = await step.condition(this._value);
          
          if (matched === true) {
            matchFound = true;

            if (matchFirst) {
              return await step.handler();
            }
            
            const result = await step.handler();

            results.push(result);
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
          if (!matchFound) {
            return await step.handler();
          }
          break;
        }
        case 'returningFirst': {
          returnFirst = step.value;
          break;
        }
      }
    }

    if (returnFirst) {
      if (results.length === 0) {
        return null;
      }

      return results[0];
    }
    
    return results;
  }
}
