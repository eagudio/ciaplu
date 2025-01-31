import { Matcher } from "./matcher/matcher";

export const match = (value: any) => new Matcher(value)
