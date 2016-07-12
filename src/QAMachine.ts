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
    console.log("state", this.idx, state);
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
    console.log("queryFrom", input, current);
    if (input.length == 0) {
      return current;
    }
    var next:State = this.next(input.shift(), current);
    return next 
      ? this.queryFrom(input, next)
      : current 
      ;
  }

  public query(input:Array<string>, idx:number = 0) : State {
    console.log("query", idx);
    return this.queryFrom(input, this.states[idx]);
  }
}
