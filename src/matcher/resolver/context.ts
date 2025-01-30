export class Context {
  private _value: any;
  private _matcher: any;
  private _returningFirst: boolean;
  private _matchingFirst: boolean;
  private _results: any[];
  private _matched: boolean;

  constructor(value: any, matcher: any, matchingFirst: boolean, returningFirst: boolean, results: any[], matched: boolean) {
    this._value = value;
    this._matcher = matcher;
    this._matchingFirst = matchingFirst;
    this._returningFirst = returningFirst;
    this._results = results;
    this._matched = matched;
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

  get returningFirst(): boolean {
    return this._returningFirst;
  }

  set returningFirst(returningFirst: boolean) {
    this._returningFirst = returningFirst;
  }

  get matchingFirst(): boolean {
    return this._matchingFirst;
  }

  set matchingFirst(matchingFirst: boolean) {
    this._matchingFirst = matchingFirst;
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
}