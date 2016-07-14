import "./QAState";

export default class QAMachine {

  protected states:any;

  protected idx:number = 0;

  // a naive normalizer
  private static normalize(m:QAMachine, obj:any) : number {
    if (!obj) return obj;
    let ret : QAState = {};
    let idx = m.state(ret);
    if (obj.title) ret.title = obj.title;
    if (obj.payload) ret.payload = obj.payload;
    if (obj.result) ret.result = obj.result;
    if (obj.answers) {
      ret.answers = {};
      let keys = Object.keys(obj.answers);
      keys.forEach(k => {
        ret.answers[k] = QAMachine.normalize(m, obj.answers[k]);
      });
    }
    return idx;
  }

  public static fromJSON(obj:any) : QAMachine {
    let m = new QAMachine({});
    QAMachine.normalize(m, obj);
    return m;
  }

  constructor(states:any) {
    this.states = states || {};
  }

  private nextIndex(idx:number) : number {
    if (this.states[idx]) {
      return this.nextIndex(idx + 1);
    }
    return idx;
  }

  public state(state:QAState) : number {
    // skip the existing indexes
    this.idx = this.nextIndex(this.idx);
    this.states[this.idx] = state;
    return this.idx++;
  }

  public get(idx:number) : QAState {
    return this.states[idx];
  }

  public nextOf(idx:number, a:string) : QAState {
    return this.next(a, this.states[idx]);
  }

  public next(a:string, current:QAState) : QAState {
    var idx = current && current.answers ? current.answers[a] : null;
    if (idx === null) {
      return null;
    }
    return this.get(idx);
  }

  public queryFrom(input:Array<string> = [], current:QAState) : QAState {
    if (input.length == 0) {
      return current;
    }
    var next:QAState = this.next(input.shift(), current);
    if (next === null) {
      return null;
    }
    return this.queryFrom(input, next);
  }

  public query(input:Array<string> = [], idx:number = 0) : QAState {
    return this.queryFrom(input.concat([]), this.states[idx]);
  }
}
