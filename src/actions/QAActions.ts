import AppDispatcher from '../dispatcher/AppDispatcher';
import QAActionID from "./QAActionID";

class QAActionsStatic {
  /**
   * @param  {string} text
   */
  public answer(trackId:number, key:string): void {
    AppDispatcher.dispatch({
      "actionType": QAActionID.QA_ANSWER,
      "key": key,
      "track": trackId
    });
  }

  public back(trackId:number): void {
    AppDispatcher.dispatch({
      "actionType": QAActionID.QA_BACK,
      "track": trackId
    });
  }
}

var QAActions: QAActionsStatic = new QAActionsStatic();
export default QAActions;
