import { Statement } from "./statement";
import { Context } from "./context";

export class OtherwiseStatement extends Statement {
  private _handler: () => Promise<any> | any;

  constructor(handler: () => Promise<any> | any) {
    super();

    this._handler = handler;
  }

  async handle(context: Context): Promise<void> {
    if (context.matched) {
      return;
    }

    const result = await this._handler();

    context.results.push(result);
  }
}
