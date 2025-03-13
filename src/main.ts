import { Matcher } from "./matcher/matcher";
import { Context } from "./matcher/statements/context";

export const match = (value: any) => new Matcher(value)
export { Matcher, Context };
