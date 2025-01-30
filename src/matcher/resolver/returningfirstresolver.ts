import { Resolver } from "./resolver";
import { Context } from "./context";

export class ReturningFirstResolver extends Resolver {
  private _returningFirst: boolean;

  constructor(returningFirst: boolean) {
    super();

    this._returningFirst = returningFirst;
  }

  async resolve(context: Context): Promise<void> {
    context.returningFirst = this._returningFirst;
  }
}
