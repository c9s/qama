
interface State { }

export default class QAMachine {

  protected states:any;

  constructor(states:any) {
    this.states = states || {};
  }

  state(code:string, state) : string {
    this.states[code] = state;
    return code;
  }

  get(code:string) : State {
    return this.states[code];
  }

  nextOf(code:string, a:string) : State {
    var current = this.get(code);
    return this.next(a, current);
  }

  next(a:string, current) : State {
    return current && current.answers ? current.answers[a] : null;
  }

  queryFrom(input:Array<string>, current:State) : State {
    if (input.length == 0) {
      return current;
    }
    var next = this.next(input.shift(), current);
    return ! next 
      ? current 
      : this.queryFrom(input, next);
  }

  query(input:Array<string>, start:string) : State {
    var state = this.states[start];
    return this.queryFrom(input, state);
  }
}
