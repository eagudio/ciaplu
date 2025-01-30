import { Context } from "./context";

export abstract class Statement {
  abstract handle(context: Context): Promise<void>;
}
