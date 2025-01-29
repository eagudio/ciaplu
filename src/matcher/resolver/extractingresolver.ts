import { Resolver } from "./resolver";
import { Result } from "./result";

export class ExtractingResolver extends Resolver {
  private _extractor: any;

  constructor(extractor: any) {
    super();

    this._extractor = extractor;
  }

  async resolve(result: Result): Promise<void> {
    result.value = await this._extractor(result.value);
  }
}
