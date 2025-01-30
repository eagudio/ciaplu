import { Statement } from "./statement";
import { Context } from "./context";

export class WhenStatement extends Statement {
  private _condition: any;
  private _handler: () => Promise<any> | any;

  constructor(condition: any, handler: () => Promise<any> | any) {
    super();

    this._condition = condition;
    this._handler = handler;
  }

  async handle(context: Context): Promise<void> {
    const matched: boolean = await this._condition(context.value);

    if (!matched) {
      context.matched = false;

      return;
    }

    context.matched = true;

    const result = await this._handler();

    context.results.push(result);
  }
}
