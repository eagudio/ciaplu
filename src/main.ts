import { Matcher } from "./matcher";

export const match = (value: any) => new Matcher(value)
