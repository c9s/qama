import EventEmitter = require('eventemitter3');

const CHANGE_EVENT = 'change';

import QAMachine from "../qamachine";

export default class EntryStore extends EventEmitter {

  protected machine: QAMachine;

  constructor(m : QAMachine) {
    super();
    this.machine = m;
  }

  public query(input, start:number = 0) {
    return this.machine.query(input, start);
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
