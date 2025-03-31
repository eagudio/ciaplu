import { Statement } from "./statement";
import { Context } from "./context";

export class WithStatement extends Statement {
  private _value: any;
  private _handler: (value: any) => Promise<any> | any;

  constructor(value: any, handler: (value: any) => Promise<any> | any) {
    super();

    this._value = value;
    this._handler = handler;
  }

  async handle(context: Context): Promise<void> {
    const matched: boolean = await context.matcher(context.value, this._value);

    if (!matched && context.toBe === true) {
      context.matched = false;

      return;
    }

    context.matched = true;

    const resulte = await this._handler(context.value);

    context.results.push(resulte);
  }

  syncHandle(context: Context): void {
    const matched: boolean = context.matcher(context.value, this._value);

    if (!matched && context.toBe === true) {
      context.matched = false;

      return;
    }

    context.matched = true;

    const resulte = this._handler(context.value);

    context.results.push(resulte);
  }
}
