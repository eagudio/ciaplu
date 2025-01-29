import { Resolver } from "./resolver";
import { Result } from "./result";

export class OtherwiseResolver extends Resolver {
  private _handler: () => Promise<any> | any;

  constructor(handler: () => Promise<any> | any) {
    super();

    this._handler = handler;
  }

  async resolve(result: Result): Promise<void> {
    const r = await this._handler();

    result.matched = true;

    result.results.push(r);
  }
}
