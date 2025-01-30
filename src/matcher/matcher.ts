import { ExtractingStatement } from "./statements/extractingstatement";
import { MatchingFirstStatement } from "./statements/matchingfirststatement";
import { OtherwiseStatement } from "./statements/otherwisestatement";
import { PerformingStatement } from "./statements/performingstatement";
import { Statement } from "./statements/statement";
import { Context } from "./statements/context";
import { ReturningFirstStatement } from "./statements/returningfirststatement";
import { WhenStatement } from "./statements/whenstatement";
import { WithStatement } from "./statements/withstatement";
import { WithTypeStatement } from "./statements/withtypestatement";

export class Matcher<T> extends Promise<any> {
  private _statements: Statement[] = [];
  private _context: Context;
  
  constructor(value: T) {
    super(() => {});
    
    this._context = new Context(value);
  }

  matchingFirst(): Matcher<T> {
    this._statements.push(new MatchingFirstStatement(true));
    
    return this;
  }

  matchingAll(): Matcher<T> {
    this._statements.push(new MatchingFirstStatement(false));

    return this;
  }

  with(
    value: any,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._statements.push(new WithStatement(value, handler));

    return this;
  }

  withType<U>(
    value: new (...args: any[]) => U,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._statements.push(new WithTypeStatement(value, handler));

    return this;
  }

  when(
    condition: (value: T) => Promise<boolean> | boolean,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._statements.push(new WhenStatement(condition, handler));

    return this;
  }

  extracting(
    extractor: (value: T) => Promise<any> | any
  ): Matcher<T> {
    this._statements.push(new ExtractingStatement(extractor));

    return this;
  }

  performing(
    matcher: (value1: any, value2: any) => Promise<boolean> | boolean
  ): Matcher<T> {
    this._statements.push(new PerformingStatement(matcher));

    return this;
  }

  otherwise(handler: () => Promise<any> | any): Matcher<T> {
    this._statements.push(new OtherwiseStatement(handler));
    
    return this;
  }

  returningFirst(): Matcher<T> {
    this._statements.push(new ReturningFirstStatement(true));
    
    return this;
  }

  returningAll(): Matcher<T> {
    this._statements.push(new ReturningFirstStatement(false));
    
    return this;
  }

  /**
    * @deprecated This method is no longer necessary and should not be used.
  */
  async resolve() {
    for (let i = 0; i < this._statements.length; i++) {
      const statement = this._statements[i];

      await statement.handle(this._context);

      if (this._context.resolve()) {
        break;
      }
    }

    return this._context.returnValue;
  }

  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return this._resolve().then(onFulfilled, onRejected);
  }

  private async _resolve() {
    for (let i = 0; i < this._statements.length; i++) {
      const statement = this._statements[i];

      await statement.handle(this._context);

      if (this._context.resolve()) {
        break;
      }
    }

    return this._context.returnValue;
  }
}
