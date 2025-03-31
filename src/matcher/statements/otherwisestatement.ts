import { Statement } from "./statement";
import { Context } from "./context";

export class OtherwiseStatement extends Statement {
  private _handler: (value: any) => Promise<any> | any;

  constructor(handler: (value: any) => Promise<any> | any) {
    super();

    this._handler = handler;
  }

  async handle(context: Context): Promise<void> {
    if (context.matched) {
      return;
    }

    const result = await this._handler(context.value);

    context.results.push(result);
  }

  syncHandle(context: Context): void {
    if (context.matched) {
      return;
    }

    const result = this._handler(context.value);

    context.results.push(result);
  }
}
