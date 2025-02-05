import { Statement } from "./statement";
import { Context } from "./context";

export class FirstStatement extends Statement {
  private _matchingFirst: boolean;

  constructor(matchingFirst: boolean) {
    super();

    this._matchingFirst = matchingFirst;
  }

  async handle(context: Context): Promise<void> {
    this.syncHandle(context);
  }

  syncHandle(context: Context): void {
    context.matchingFirst = this._matchingFirst;
  }
}
