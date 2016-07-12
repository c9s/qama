import EventEmitter = require('eventemitter3');

const CHANGE_EVENT = 'change';

import QAMachine from "../qamachine";

export default class EntryStore extends EventEmitter {

  protected machine: QAMachine;

  protected answers: Array<string>;

  constructor(m : QAMachine) {
    super();
    this.machine = m;
  }

  public push(a) {
    this.answers.push(a);
    this.emitChange();
  }

  public pop() {
    this.answers.pop();
    this.emitChange();
  }

  public reset() {
    this.answers = [];
    this.emitChange();
  }

  /**
   * You must tell it where to start the state machine.
   */
  public query(input, init:number) {
    return this.machine.query(input, init);
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
