import EventEmitter = require('eventemitter3');
import AppDispatcher from '../dispatcher/AppDispatcher';
import QAActions from "../actions/QAActionID";

const CHANGE_EVENT = 'change';

import QAMachine from "../qamachine";

export default class EntryStore extends EventEmitter {

  protected machine: QAMachine;

  protected answers: Array<string>;

  protected initState: number;

  constructor(m : QAMachine, initState:number) {
    super();
    this.machine = m;
    this.initState  = initState;
    this.answers = [];

    AppDispatcher.register((a:any) => {
      switch(a.actionType) {
        case QAActions.QA_ANSWER:
          this.push(a.key);
          break;
        case QAActions.QA_BACK:
          this.pop();
          break;
      }
    });
  }

  public push(a:string) {
    this.answers.push(a);
    this.emitChange();
  }

  public pop() {
    this.answers.pop();
    this.emitChange();
  }

  public getAnswers() : Array<string> {
    return this.answers;
  }

  public reset() {
    this.answers = [];
    this.emitChange();
  }

  public current() {
    console.log("current answers", this.answers);
    return this.machine.query(this.answers, this.initState);
  }

  /**
   * You must tell it where to start the state machine.
   */
  public query(input, init:number) {
  }

  public next(answer, current) {
    return this.machine.next(answer, current);
  }

  public emitChange(): void {
    this.emit(CHANGE_EVENT);
  }

  /**
   * @param {function} callback
   */
  public addChangeListener(callback: () => void): void {
    this.on(CHANGE_EVENT, callback);
  }

  /**
   * @param {function} callback
   */
  public removeChangeListener(callback: () => void) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}
