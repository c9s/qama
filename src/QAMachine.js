"use strict";
require("./State");
var QAMachine = (function () {
    function QAMachine(states) {
        this.idx = 0;
        this.states = states || {};
    }
    QAMachine.prototype.nextIndex = function (idx) {
        if (this.states[idx]) {
            return this.nextIndex(idx + 1);
        }
        return idx;
    };
    QAMachine.prototype.state = function (state) {
        // skip the existing indexes
        this.idx = this.nextIndex(this.idx);
        this.states[this.idx] = state;
        console.log("state", this.idx, state);
        return this.idx++;
    };
    QAMachine.prototype.get = function (idx) {
        return this.states[idx];
    };
    QAMachine.prototype.nextOf = function (idx, a) {
        return this.next(a, this.states[idx]);
    };
    QAMachine.prototype.next = function (a, current) {
        var idx = current && current.answers ? current.answers[a] : null;
        if (idx === null) {
            return null;
        }
        return this.get(idx);
    };
    QAMachine.prototype.queryFrom = function (input, current) {
        console.log("queryFrom", input, current);
        if (input.length == 0) {
            return current;
        }
        var next = this.next(input.shift(), current);
        return next
            ? this.queryFrom(input, next)
            : current;
    };
    QAMachine.prototype.query = function (input, idx) {
        if (idx === void 0) { idx = 0; }
        console.log("query", idx);
        return this.queryFrom(input, this.states[idx]);
    };
    return QAMachine;
}());
exports.__esModule = true;
exports["default"] = QAMachine;
