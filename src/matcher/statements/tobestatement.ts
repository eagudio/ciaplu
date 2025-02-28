import { Statement } from "./statement";
import { Context } from "./context";

export class ToBeStatement extends Statement {
  private _toBe: boolean = true;

  constructor(toBe: boolean) {
    super();

    this._toBe = toBe;
  }

  async handle(context: Context): Promise<void> {
    this.syncHandle(context);
  }

  syncHandle(context: Context): void {
    context.toBe = this._toBe;
  }
}
