import { Resolver } from "./resolver";
import { Result } from "./result";

export class PerformingResolver extends Resolver {
  private _matcher: any;

  constructor(matcher: any) {
    super();

    this._matcher = matcher;
  }

  async resolve(result: Result): Promise<void> {
    result.matcher = this._matcher;
  }
}
