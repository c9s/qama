

/**
 * AnswerStore stores the current answer strings
 */
class AnswerStore {

  protected answers: Array<string>;

  constructor() {
    this.answers = [];
  }

  public push(a) {
    this.answers.push(a);
  }

  public pop() {
    return this.answers.pop();
  }
}
