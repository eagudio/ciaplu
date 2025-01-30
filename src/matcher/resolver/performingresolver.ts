import { Resolver } from "./resolver";
import { Context } from "./context";

export class PerformingResolver extends Resolver {
  private _matcher: any;

  constructor(matcher: any) {
    super();

    this._matcher = matcher;
  }

  async resolve(context: Context): Promise<void> {
    context.matcher = this._matcher;
  }
}
