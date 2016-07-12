/// <reference path="../typings/globals/mocha/index.d.ts" />

import QAMachine from '../src/QAMachine';
import { assert } from 'chai';

describe('QAMachine', () => {
  it('query', () => {
    var m = this.machine = new QAMachine({});
    var init = m.state({
        "question": "question1",
        "payload": {},
        "answers": {
            "yes": m.state({
                "question": "question2",
                "answers": {
                    "yes": m.state({
                      "question": "question3"
                    }),
                    "no": m.state({
                      "question": "question4"
                    }),
                }
            }),
            "no": m.state({
                "payload": { "message": "請回家 XD" },
            })
        }
    });
    var last;
    last = m.query([], init);
    assert.equal("question1", last.question);

    last = m.query(["yes"], init);
    assert.equal("question2", last.question);

    last = m.query(["yes", "yes"], init);
    assert.equal("question3", last.question);

    last = m.query(["yes", "no"], init);
    assert.equal("question4", last.question);
  });
});
