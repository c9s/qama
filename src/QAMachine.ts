import "./State";

export default class QAMachine {

  protected states:any;

  protected idx:number = 0;

  constructor(states:any) {
    this.states = states || {};
  }

  private nextIndex(idx:number) : number {
    if (this.states[idx]) {
      return this.nextIndex(idx + 1);
    }
    return idx;
  }

  public state(state:State) : number {
    // skip the existing indexes
    this.idx = this.nextIndex(this.idx);
    this.states[this.idx] = state;
    return this.idx++;
  }

  public get(idx:number) : State {
    return this.states[idx];
  }

  public nextOf(idx:number, a:string) : State {
    return this.next(a, this.states[idx]);
  }

  public next(a:string, current:State) : State {
    var idx = current && current.answers ? current.answers[a] : null;
    if (idx === null) {
      return null;
    }
    return this.get(idx);
  }

  public queryFrom(input:Array<string>, current:State) : State {
    if (input.length == 0) {
      return current;
    }
    var next:State = this.next(input.shift(), current);
    if (next === null) {
      return null;
    }
    return this.queryFrom(input, next);
  }

  public query(input:Array<string>, idx:number = 0) : State {
    return this.queryFrom(input.concat([]), this.states[idx]);
  }
}
