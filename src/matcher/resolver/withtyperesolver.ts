import { Resolver } from "./resolver";
import { Context } from "./context";

export class WithTypeResolver extends Resolver {
  private _value: any;
  private _handler: () => Promise<any> | any;

  constructor(value: any, handler: () => Promise<any> | any) {
    super();

    this._value = value;
    this._handler = handler;
  }

  async resolve(context: Context): Promise<void> {
    if (!(context.value instanceof this._value)) {
      context.matched = false;

      return;
    }

    context.matched = true;

    const result = await this._handler();

    context.results.push(result);
  }
}
