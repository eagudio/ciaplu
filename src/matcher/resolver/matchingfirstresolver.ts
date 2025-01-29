import { Resolver } from "./resolver";
import { Result } from "./result";

export class MatchingFirstResolver extends Resolver {
  private _matchingFirst: boolean;

  constructor(matchingFirst: boolean) {
    super();

    this._matchingFirst = matchingFirst;
  }

  async resolve(result: Result): Promise<void> {
    result.matchingFirst = this._matchingFirst;
  }
}
