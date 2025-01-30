import { Resolver } from "./resolver";
import { Context } from "./context";

export class MatchingFirstResolver extends Resolver {
  private _matchingFirst: boolean;

  constructor(matchingFirst: boolean) {
    super();

    this._matchingFirst = matchingFirst;
  }

  async resolve(context: Context): Promise<void> {
    context.matchingFirst = this._matchingFirst;
  }
}
