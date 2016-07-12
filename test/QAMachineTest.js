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
});
