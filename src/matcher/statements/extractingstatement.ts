import { Statement } from "./statement";
import { Context } from "./context";

export class ExtractingStatement extends Statement {
  private _extractor: any;

  constructor(extractor: any) {
    super();

    this._extractor = extractor;
  }

  async handle(context: Context): Promise<void> {
    context.value = await this._extractor(context.value);
  }
}
