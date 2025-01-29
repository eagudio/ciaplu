import { Result } from "./result";

export abstract class Resolver {
  abstract resolve(result: Result): Promise<void>;
}
