import { Statement } from "./statement";
import { Context } from "./context";

export class PerformingStatement extends Statement {
  private _matcher: any;

  constructor(matcher: any) {
    super();

    this._matcher = matcher;
  }

  async handle(context: Context): Promise<void> {
    this.syncHandle(context);
  }

  syncHandle(context: Context): void {
    context.matcher = this._matcher;
  }
}
