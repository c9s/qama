import EventEmitter = require('eventemitter3');

const CHANGE_EVENT = 'change';

import QAMachine from "../qamachine";

export default class EntryStore extends EventEmitter {

  protected machine: QAMachine;

  constructor(m : QAMachine) {
    super();
    this.machine = m;
    m.state("Q1", {
        "question": "Q1 你是勞工嗎？",
        "payload": {},
        "answers": {
            "是": m.state("Q2", {
                "question": "Q2 你是領...",
                "answers": {
                    "月薪": null,
                    "時薪": null,
                }
            }),
            "不是": m.state("Q3", {
                "payload": { "message": "請回家 XD" },
            })
        }
    });
  }

  public query(input, start) {
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
