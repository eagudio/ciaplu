import { Statement } from "./statement";
import { Context } from "./context";

export class WithTypeStatement extends Statement {
  private _value: any;
  private _handler: (value: any) => Promise<any> | any;

  constructor(value: any, handler: (value: any) => Promise<any> | any) {
    super();

    this._value = value;
    this._handler = handler;
  }

  async handle(context: Context): Promise<void> {
    if (!(context.value instanceof this._value)) {
      context.matched = false;

      return;
    }

    context.matched = true;

    const result = await this._handler(context.value);

    context.results.push(result);
  }

  syncHandle(context: Context): void {
    if (!(context.value instanceof this._value)) {
      context.matched = false;

      return;
    }

    context.matched = true;

    const result = this._handler(context.value);

    context.results.push(result);
  }
}
