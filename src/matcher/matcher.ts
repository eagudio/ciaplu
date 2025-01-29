import { ExtractingResolver } from "./resolver/extractingresolver";
import { MatchingFirstResolver } from "./resolver/matchingfirstresolver";
import { OtherwiseResolver } from "./resolver/otherwiseresolver";
import { PerformingResolver } from "./resolver/performingresolver";
import { Resolver } from "./resolver/resolver";
import { Result } from "./resolver/result";
import { ReturningFirstResolver } from "./resolver/returningfirstresolver";
import { WhenResolver } from "./resolver/whenresolver";
import { WithResolver } from "./resolver/withresolver";
import { WithTypeResolver } from "./resolver/withtyperesolver";

export class Matcher<T> {
  private _value: T;
  private _steps: Resolver[] = [];
  
  constructor(value: T) {
    this._value = value;
  }

  matchingFirst(): Matcher<T> {
    // this._steps.push({type: 'matchingFirst', value: true});
    this._steps.push(new MatchingFirstResolver(true));
    
    return this;
  }

  matchingAll(): Matcher<T> {
    // this._steps.push({type: 'matchingFirst', value: false});
    this._steps.push(new MatchingFirstResolver(false));

    return this;
  }

  with(
    value: any,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    // this._steps.push({type: 'with', value, handler});
    this._steps.push(new WithResolver(value, handler));

    return this;
  }

  withType<U>(
    value: new (...args: any[]) => U,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    // this._steps.push({type: 'withType', value, handler});
    this._steps.push(new WithTypeResolver(value, handler));

    return this;
  }

  when(
    condition: (value: T) => Promise<boolean> | boolean,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    // this._steps.push({type: 'when', condition, handler});
    this._steps.push(new WhenResolver(condition, handler));

    return this;
  }

  extracting(
    extractor: (value: T) => Promise<any> | any
  ): Matcher<T> {
    // this._steps.push({type: 'extracting', extractor});
    this._steps.push(new ExtractingResolver(extractor));

    return this;
  }

  performing(
    matcher: (value1: any, value2: any) => Promise<boolean> | boolean
  ): Matcher<T> {
    // this._steps.push({type: 'performing', matcher});
    this._steps.push(new PerformingResolver(matcher));

    return this;
  }

  otherwise(handler: () => Promise<any> | any): Matcher<T> {
    // this._steps.push({type: 'otherwise', handler});
    this._steps.push(new OtherwiseResolver(handler));
    
    return this;
  }

  returningFirst(): Matcher<T> {
    // this._steps.push({type: 'returningFirst', value: true});
    this._steps.push(new ReturningFirstResolver(true));
    
    return this;
  }

  returningAll(): Matcher<T> {
    // this._steps.push({type: 'returningFirst', value: false});
    this._steps.push(new ReturningFirstResolver(false));
    
    return this;
  }

  async resolve() {
    const result: Result = new Result(
      this._value,
      (value1: any, value2: any) => Promise.resolve(value1 === value2),
      true,
      true,
      [],
      false
    );

    for (let i = 0; i < this._steps.length; i++) {
      const step = this._steps[i];

      await step.resolve(result);

      if (result.matched) {
        if (result.matchingFirst) {
          if (result.results.length === 0) {
            return null;
          }
  
          return result.results[0];
        }
      }
    }

    if (result.matched) {
      if (result.returningFirst) {
        if (result.results.length === 0) {
          return null;
        }

        return result.results[0];
      }

      return result.results;
    }

    return null;
  }

  // async resolve() {
  //   let matchFirst: boolean = true;
  //   let returnFirst: boolean = true;
  //   let withMatcher = (value1: any, value2: any) => Promise.resolve(value1 === value2);
  //   let results: any[] = [];
  //   let matchFound = false;

  //   for (let i = 0; i < this._steps.length; i++) {
  //     const step = this._steps[i];

  //     switch (step.type) {
  //       case 'matchingFirst': {
  //         matchFirst = step.value;
  //         break;
  //       }
  //       case 'with': {
  //         const matched: boolean = await withMatcher(this._value, step.value);

  //         if (matched === true) {
  //           matchFound = true;

  //           if (matchFirst) {
  //             return await step.handler();
  //           }

  //           const result = await step.handler();

  //           results.push(result);
  //         }
  //         break;
  //       }
  //       case 'withType': {
  //         if (this._value instanceof step.value) {
  //           matchFound = true;

  //           if (matchFirst) {
  //             return await step.handler();
  //           }

  //           const result = await step.handler();

  //           results.push(result);
  //         }
  //         break;
  //       }
  //       case 'when': {
  //         const matched: boolean = await step.condition(this._value);
          
  //         if (matched === true) {
  //           matchFound = true;

  //           if (matchFirst) {
  //             return await step.handler();
  //           }
            
  //           const result = await step.handler();

  //           results.push(result);
  //         }
  //         break;
  //       }
  //       case 'extracting': {
  //         this._value = await step.extractor(this._value);
  //         break;
  //       }
  //       case 'performing': {
  //         withMatcher = step.matcher;
  //         break;
  //       }
  //       case 'otherwise': {
  //         if (!matchFound) {
  //           return await step.handler();
  //         }
  //         break;
  //       }
  //       case 'returningFirst': {
  //         returnFirst = step.value;
  //         break;
  //       }
  //     }
  //   }

  //   if (returnFirst) {
  //     if (results.length === 0) {
  //       return null;
  //     }

  //     return results[0];
  //   }
    
  //   return results;
  // }
}
