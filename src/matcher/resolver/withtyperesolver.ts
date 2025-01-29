import { Resolver } from "./resolver";
import { Result } from "./result";

export class WithTypeResolver extends Resolver {
  private _value: any;
  private _handler: () => Promise<any> | any;

  constructor(value: any, handler: () => Promise<any> | any) {
    super();

    this._value = value;
    this._handler = handler;
  }

  async resolve(result: Result): Promise<void> {
    if (!(result.value instanceof this._value)) {
      result.matched = false;

      return;
    }

    result.matched = true;

    const r = await this._handler();

    result.results.push(r);
  }
}
