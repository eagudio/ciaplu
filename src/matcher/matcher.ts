import { ExtractingStatement } from "./statements/extractingstatement";
import { FirstStatement } from "./statements/firststatement";
import { OtherwiseStatement } from "./statements/otherwisestatement";
import { MatchingStatement } from "./statements/matchingstatement";
import { Statement } from "./statements/statement";
import { Context } from "./statements/context";
import { OneStatement } from "./statements/onestatement";
import { WhenStatement } from "./statements/whenstatement";
import { WithStatement } from "./statements/withstatement";
import { WithTypeStatement } from "./statements/withtypestatement";
import { ToBeStatement } from "./statements/tobestatement";

export class Matcher<T> extends Promise<any> {
  private _statements: Statement[] = [];
  protected _context: Context;
  
  constructor(value: T) {
    super(() => {});
    
    this._context = new Context(value);
  }

  first(): Matcher<T> {
    this._statements.push(new FirstStatement(true));
    
    return this;
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future release.  
   * Please use {@link first} instead.  
   */
  matchingFirst(): Matcher<T> {    
    return this.first();
  }

  any(): Matcher<T> {
    this._statements.push(new FirstStatement(false));

    return this;
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future release.  
   * Please use {@link any} instead.  
   */
  matchingAll(): Matcher<T> {
    return this.any();
  }

  with(
    value: any,
    handler: (value: any) => Promise<any> | any = () => true
  ): Matcher<T> {
    this._statements.push(new WithStatement(value, handler));

    return this;
  }

  withType<U>(
    value: new (...args: any[]) => U,
    handler: (value: any) => Promise<any> | any = () => true
  ): Matcher<T> {
    this._statements.push(new WithTypeStatement(value, handler));

    return this;
  }

  when(
    condition: (value: T) => Promise<boolean> | boolean,
    handler: (value: any) => Promise<any> | any = () => true
  ): Matcher<T> {
    this._statements.push(new WhenStatement(condition, handler));

    return this;
  }

  not() {
    this._statements.push(new ToBeStatement(false));

    return this;
  }

  yet() {
    this._statements.push(new ToBeStatement(true));

    return this;
  }

  extracting(
    extractor: (value: T) => Promise<any> | any
  ): Matcher<T> {
    this._statements.push(new ExtractingStatement(extractor));

    return this;
  }

  test(
    matcher: (value1: any, value2: any) => Promise<boolean> | boolean
  ): Matcher<T> {
    this._statements.push(new MatchingStatement(matcher));

    return this;
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future release.  
   * Please use {@link test} instead.  
   */
  matching(
    matcher: (value1: any, value2: any) => Promise<boolean> | boolean
  ): Matcher<T> {
    return this.test(matcher);
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future release.  
   * Please use {@link matching} instead.  
   */
  performing(
    matcher: (value1: any, value2: any) => Promise<boolean> | boolean
  ): Matcher<T> {
    return this.matching(matcher);
  }

  otherwise(handler: (value: any) => Promise<any> | any): Matcher<T> {
    this._statements.push(new OtherwiseStatement(handler));
    
    return this;
  }

  one(): Matcher<T> {
    this._statements.push(new OneStatement(true));
    
    return this;
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future release.  
   * Please use {@link one} instead.  
   */
  returningFirst(): Matcher<T> {
    return this.one();
  }

  all(): Matcher<T> {
    this._statements.push(new OneStatement(false));
    
    return this;
  }

  /**
   * @deprecated This method is deprecated and will be removed in a future release.  
   * Please use {@link all} instead.  
   */
  returningAll(): Matcher<T> {    
    return this.all();
  }

  return(): any {
    this._context.matcher = (value1: any, value2: any) => value1 === value2;

    for (let i = 0; i < this._statements.length; i++) {
      const statement = this._statements[i];

      statement.syncHandle(this._context);

      if (this._context.resolve()) {
        break;
      }
    }

    return this._context.returnValue;
  }

  /**
    * @deprecated This method is no longer necessary and should not be used.
  */
  async resolve() {
    return await this._resolve();
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
