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

  it("normalize JSON", () => {
		const json = {
			"question": "Q1",
			"payload": { "foo": "bar" },
			"answers": {
				"A1": {
					"question": "Q2",
					"answers": {
						"A3": null,
						"A4": {
							"question": "Q3",
							"answers": {
								"A5": null,
								"A6": null
							}
						}
					}
				},
				"A2": {
					"question": "Q4",
					"answers": {
						"A7": null
					}
				}
			}
		};

    const m = QAMachine.fromJSON(json);
    assert.equal(m.get(0).question, "Q1");
    assert.equal(m.get(1).question, "Q2");
    assert.equal(m.get(2).question, "Q3");
    assert.equal(m.get(3).question, "Q4");
    for (let i of [0, 1, 2, 3]) {
      let s = m.get(i);
      for (let k in s.answers) {
        let a = s.answers[k];
        assert.isOk(typeof a === "number" || a === null);
			}
		}
  });
});
