import { ExtractingResolver } from "./resolver/extractingresolver";
import { MatchingFirstResolver } from "./resolver/matchingfirstresolver";
import { OtherwiseResolver } from "./resolver/otherwiseresolver";
import { PerformingResolver } from "./resolver/performingresolver";
import { Resolver } from "./resolver/resolver";
import { Context } from "./resolver/context";
import { ReturningFirstResolver } from "./resolver/returningfirstresolver";
import { WhenResolver } from "./resolver/whenresolver";
import { WithResolver } from "./resolver/withresolver";
import { WithTypeResolver } from "./resolver/withtyperesolver";

export class Matcher<T> {
  private _value: T;
  private _resolvers: Resolver[] = [];
  
  constructor(value: T) {
    this._value = value;
  }

  matchingFirst(): Matcher<T> {
    this._resolvers.push(new MatchingFirstResolver(true));
    
    return this;
  }

  matchingAll(): Matcher<T> {
    this._resolvers.push(new MatchingFirstResolver(false));

    return this;
  }

  with(
    value: any,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._resolvers.push(new WithResolver(value, handler));

    return this;
  }

  withType<U>(
    value: new (...args: any[]) => U,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._resolvers.push(new WithTypeResolver(value, handler));

    return this;
  }

  when(
    condition: (value: T) => Promise<boolean> | boolean,
    handler: () => Promise<any> | any
  ): Matcher<T> {
    this._resolvers.push(new WhenResolver(condition, handler));

    return this;
  }

  extracting(
    extractor: (value: T) => Promise<any> | any
  ): Matcher<T> {
    this._resolvers.push(new ExtractingResolver(extractor));

    return this;
  }

  performing(
    matcher: (value1: any, value2: any) => Promise<boolean> | boolean
  ): Matcher<T> {
    this._resolvers.push(new PerformingResolver(matcher));

    return this;
  }

  otherwise(handler: () => Promise<any> | any): Matcher<T> {
    this._resolvers.push(new OtherwiseResolver(handler));
    
    return this;
  }

  returningFirst(): Matcher<T> {
    this._resolvers.push(new ReturningFirstResolver(true));
    
    return this;
  }

  returningAll(): Matcher<T> {
    this._resolvers.push(new ReturningFirstResolver(false));
    
    return this;
  }

  async resolve() {
    const context: Context = new Context(
      this._value,
      (value1: any, value2: any) => Promise.resolve(value1 === value2),
      true,
      true,
      [],
      false
    );

    for (let i = 0; i < this._resolvers.length; i++) {
      const resolver = this._resolvers[i];

      await resolver.resolve(context);

      if (context.matchingFirst && context.matched) {
        if (context.results.length === 0) {
          return null;
        }

        return context.results[0];
      }
    }

    if (context.returningFirst) {
      if (context.results.length === 0) {
        return null;
      }

      return context.results[0];
    }

    return context.results;
  }
}
