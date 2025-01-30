import { Resolver } from "./resolver";
import { Context } from "./context";

export class OtherwiseResolver extends Resolver {
  private _handler: () => Promise<any> | any;

  constructor(handler: () => Promise<any> | any) {
    super();

    this._handler = handler;
  }

  async resolve(context: Context): Promise<void> {
    if (context.matched) {
      return;
    }

    const result = await this._handler();

    context.results.push(result);
  }
}
