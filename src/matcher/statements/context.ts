export class Context {
  private _value: any;
  private _matcher: any;
  private _toBe: boolean;
  private _returningFirst: boolean;
  private _matchingFirst: boolean;
  private _results: any[];
  private _matched: boolean;
  private _returnValue: any;

  constructor(value: any) {
    this._value = value;
    this._matcher = (value1: any, value2: any) => Promise.resolve(value1 === value2);
    this._toBe = true;
    this._matchingFirst = true;
    this._returningFirst = true;
    this._results = [];
    this._matched = false;
    this._returnValue = null;
  }

  get value(): any {
    return this._value;
  }

  set value(value: any) {
    this._value = value;
  }

  get matcher(): any {
    return this._matcher;
  }

  set matcher(matcher: any) {
    this._matcher = matcher;
  }

  get toBe(): boolean {
    return this._toBe;
  }

  set toBe(toBe: boolean) {
    this._toBe = toBe;
  }

  get matchingFirst(): boolean {
    return this._matchingFirst;
  }

  set matchingFirst(matchingFirst: boolean) {
    this._matchingFirst = matchingFirst;
  }

  get returningFirst(): boolean {
    return this._returningFirst;
  }

  set returningFirst(returningFirst: boolean) {
    this._returningFirst = returningFirst;
  }

  get results(): any[] {
    return this._results;
  }

  set results(results: any[]) {
    this._results = results;
  }

  get matched(): boolean {
    return this._matched;
  }

  set matched(matched: boolean) {
    this._matched = matched;
  }

  get returnValue(): any { 
    return this._returnValue;
  }

  set returnValue(returnValue: any) {
    this._returnValue = returnValue;
  }

  resolve(): boolean {
    let resolved: boolean = false;

    if (this.matchingFirst && this.matched) {
      resolved = true;

      if (this.results.length === 0) {
        this.returnValue = null;
      } else {
        this.returnValue = this.results[0];
      }
    }

    if (this.returningFirst) {
      if (this.results.length === 0) {
        this.returnValue = null;
      } else {
        this.returnValue = this.results[0];
      }
    } else {
      this.returnValue = this.results;
    }

    return resolved;
  }
}