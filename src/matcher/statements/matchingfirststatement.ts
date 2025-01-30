import { Statement } from "./statement";
import { Context } from "./context";

export class MatchingFirstStatement extends Statement {
  private _matchingFirst: boolean;

  constructor(matchingFirst: boolean) {
    super();

    this._matchingFirst = matchingFirst;
  }

  async handle(context: Context): Promise<void> {
    context.matchingFirst = this._matchingFirst;
  }
}
