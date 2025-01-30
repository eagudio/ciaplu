import { Context } from "./context";

export abstract class Resolver {
  abstract resolve(context: Context): Promise<void>;
}
