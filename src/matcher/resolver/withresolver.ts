import { Resolver } from "./resolver";
import { Context } from "./context";

export class WithResolver extends Resolver {
  private _value: any;
  private _handler: () => Promise<any> | any;

  constructor(value: any, handler: () => Promise<any> | any) {
    super();

    this._value = value;
    this._handler = handler;
  }

  async resolve(context: Context): Promise<void> {
    const matched: boolean = await context.matcher(context.value, this._value);

    if (!matched) {
      context.matched = false;

      return;
    }

    context.matched = true;

    const resulte = await this._handler();

    context.results.push(resulte);
  }
}
