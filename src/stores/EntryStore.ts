import EventEmitter = require('eventemitter3');
import AppDispatcher from '../dispatcher/AppDispatcher';
import QAActions from "../actions/QAActionID";
import * as querystring from "query-string";
import "../QAState";

const CHANGE_EVENT = 'change';

import QAMachine from "../qamachine";

type AnswerList = Array<string>;

interface TrackAnswers {
    [trackId: number]: AnswerList;
}

export default class EntryStore extends EventEmitter {

  protected machine: QAMachine;

  protected tracks: TrackAnswers;

  constructor(m : QAMachine) {
    super();
    this.machine = m;
    this.tracks = {};

    AppDispatcher.register((a:any) => {
      switch(a.actionType) {
        case QAActions.QA_ANSWER:
          this.push(a.track, a.key);
          break;
        case QAActions.QA_BACK:
          this.pop(a.track);
          break;
      }
    });
  }

  public push(trackId:number, a:string) {
    if (!this.tracks[trackId]) {
      this.tracks[trackId] = [];
    }
    this.tracks[trackId].push(a);
    this.emitChange();
  }

  public pop(trackId) {
    if (this.tracks[trackId]) {
      this.tracks[trackId].pop();
    }
    this.emitChange();
  }

  public getAnswers(trackId:number) : AnswerList {
    return this.tracks[trackId] || [];
  }

  // set answers without echoing
  public setAnswers(trackId:number, answers:AnswerList) : void {
    this.tracks[trackId] = answers;
  }

  public reset() {
    for (var key in this.tracks) {
      this.tracks[key] = [];
    }
    this.emitChange();
  }

  /**
   * query the current state by the track ID.
   */
  public current(trackId: number) : QAState {
    return this.machine.query(this.tracks[trackId] || [], trackId);
  }

  /**
   * get the next state from the current state by "answer"
   */
  public next(a:string, current:QAState) : QAState {
    return this.machine.next(a, current);
  }

  public emitChange(): void {
    this.emit(CHANGE_EVENT);
  }


  public loadQueryString(qs:string) {
    let params = querystring.parse(location.search);
    for (let key in params) {
      this.tracks[key] = params[key].split(/,/);
      console.info("loaded tracks",this.tracks, "from", qs);
    }
  }

  /**
   * serialize track states to query string
   */
  public serialize():string {
    var params = [];
    for (let key in this.tracks) {
      params[key] = this.tracks[key].join(',');
    }
    return querystring.stringify(params);
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
