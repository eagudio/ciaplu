import { Resolver } from "./resolver";
import { Result } from "./result";

export class ReturningFirstResolver extends Resolver {
  private _returningFirst: boolean;

  constructor(returningFirst: boolean) {
    super();

    this._returningFirst = returningFirst;
  }

  async resolve(result: Result): Promise<void> {
    result.returningFirst = this._returningFirst;
  }
}
