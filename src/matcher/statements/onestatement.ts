import { Statement } from "./statement";
import { Context } from "./context";

export class OneStatement extends Statement {
  private _returningFirst: boolean;

  constructor(returningFirst: boolean) {
    super();

    this._returningFirst = returningFirst;
  }

  async handle(context: Context): Promise<void> {
    this.syncHandle(context);
  }

  syncHandle(context: Context): void {
    context.returningFirst = this._returningFirst;

    if (context.returningFirst) {
      if (context.results.length === 0) {
        context.returnValue = null;
      } else {
        context.returnValue = context.results[0];
      }
    } else {
      context.returnValue = context.results;
    }
  }
}
