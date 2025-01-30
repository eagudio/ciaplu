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

export class Matcher<T> {
  private _value: T;
  private _statements: Statement[] = [];
  
  constructor(value: T) {
    this._value = value;
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

  async resolve() {
    const context: Context = new Context(this._value);

    for (let i = 0; i < this._statements.length; i++) {
      const statement = this._statements[i];

      await statement.handle(context);

      if (context.resolve()) {
        break;
      }
    }

    return context.returnValue;
  }
}
