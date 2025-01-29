import { Resolver } from "./resolver";
import { Result } from "./result";

export class WhenResolver extends Resolver {
  private _condition: any;
  private _handler: () => Promise<any> | any;

  constructor(condition: any, handler: () => Promise<any> | any) {
    super();

    this._condition = condition;
    this._handler = handler;
  }

  async resolve(result: Result): Promise<void> {
    const matched: boolean = await this._condition(result.value);

    if (!matched) {
      result.matched = false;

      return;
    }

    result.matched = true;

    const r = await this._handler();

    result.results.push(r);
  }
}
