import { Resolver } from "./resolver";
import { Result } from "./result";

export class WithResolver extends Resolver {
  private _value: any;
  private _handler: () => Promise<any> | any;

  constructor(value: any, handler: () => Promise<any> | any) {
    super();

    this._value = value;
    this._handler = handler;
  }

  async resolve(result: Result): Promise<void> {
    const matched: boolean = await result.matcher(result.value, this._value);

    if (!matched) {
      result.matched = false;

      return;
    }

    result.matched = true;

    const r = await this._handler();

    result.results.push(r);
  }
}
