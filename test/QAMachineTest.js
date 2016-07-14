/// <reference path="../typings/globals/mocha/index.d.ts" />
"use strict";
var _this = this;
var QAMachine_1 = require('../src/QAMachine');
var chai_1 = require('chai');
describe('QAMachine', function () {
    it('query', function () {
        var m = _this.machine = new QAMachine_1["default"]({});
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
                        })
                    }
                }),
                "no": m.state({
                    "payload": { "message": "請回家 XD" }
                })
            }
        });
        var last;
        last = m.query([], init);
        chai_1.assert.equal("question1", last.question);
        last = m.query(["yes"], init);
        chai_1.assert.equal("question2", last.question);
        last = m.query(["yes", "yes"], init);
        chai_1.assert.equal("question3", last.question);
        last = m.query(["yes", "no"], init);
        chai_1.assert.equal("question4", last.question);
    });
    it("normalize JSON", function () {
        var json = {
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
        var m = QAMachine_1["default"].fromJSON(json);
        chai_1.assert.equal(m.get(0).question, "Q1");
        chai_1.assert.equal(m.get(1).question, "Q2");
        chai_1.assert.equal(m.get(2).question, "Q3");
        chai_1.assert.equal(m.get(3).question, "Q4");
        for (var _i = 0, _a = [0, 1, 2, 3]; _i < _a.length; _i++) {
            var i = _a[_i];
            var s = m.get(i);
            for (var k in s.answers) {
                var a = s.answers[k];
                chai_1.assert.isOk(typeof a === "number" || a === null);
            }
        }
    });
});
