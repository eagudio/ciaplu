import { Resolver } from "./resolver";
import { Context } from "./context";

export class ExtractingResolver extends Resolver {
  private _extractor: any;

  constructor(extractor: any) {
    super();

    this._extractor = extractor;
  }

  async resolve(context: Context): Promise<void> {
    context.value = await this._extractor(context.value);
  }
}
