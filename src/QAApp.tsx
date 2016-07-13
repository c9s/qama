import * as React from "react";
// install with `typings install --save npm~history`
import { History, Location, createHistory } from "history";
import * as queryString from "query-string";
import AnswerSection from "./components/AnswerSection";
import QuestionSection from "./components/QuestionSection";
import QAMachine from "./QAMachine";
import EntryStore from "./stores/EntryStore";

import AppDispatcher from './dispatcher/AppDispatcher';

interface QAAppProps {
  // Question state
  qState: any;
}

interface QAAppState {
  qState: any;
}

export default class QAApp extends React.Component<QAAppProps, QAAppState> {

    protected history : History;

    protected unlistenHistory : Function;

    protected machine : any;

    protected entry : EntryStore;

    protected initIdx : number;

    constructor(props : QAAppProps) {
        super(props);
        this.history = createHistory();
        var m = this.machine = new QAMachine({});
        this.initIdx = m.state({
            "question": "Q1 你是勞工嗎？",
            "payload": {},
            "answers": {
                "是": m.state({
                    "question": "Q2 你是領...",
                    "answers": {
                        "月薪": null,
                        "時薪": null,
                    }
                }),
                "不是": m.state({
                    "question": "請回家 XD",
                    "payload": { "message": "請回家 XD" },
                })
            }
        });
        this.entry = new EntryStore(this.machine, this.initIdx);
        this.state = { "qState": this.entry.current() };
    }

    private handleHistory(location : Location) {
        switch(location.action) {
            case "POP": {
              let query = queryString.parse(location.search);
              let answers = query.answers ? query.answers.split(",") : [];
              this.entry.setAnswers(answers);
              this.setState({ "qState" : this.entry.current() } as QAAppState);
              break;
            }
            default:
        }
    }

    public componentDidMount() :void {
        this.entry.addChangeListener(this.handleChange.bind(this));
        this.unlistenHistory = this.history.listen(this.handleHistory.bind(this));
        // location is global
        this.handleHistory({ "action": "POP", "search": location.search });
    }

    public componentWillUnmount() :void {
        this.entry.removeChangeListener(this.handleChange.bind(this));
        this.unlistenHistory();
        this.unlistenHistory = null;
    }

    public handleChange() {
        var current = this.entry.current();
        var { answers } = this.entry;
        if (answers.length) {
            var query = queryString.stringify({ "answers": answers.join(",") });
            this.history.push({ "search": "?" + query });
        } else {
            this.history.push({ "search": "" });
        }
        this.setState({"qState" : current} as QAAppState);
    }

    public render() {
        var qstate = this.state.qState;
        if (!qstate) {
            return <div className="jumbotron"> </div>;
        }
        // Use the current answer list to query the last state
        return <div className="jumbotron">
            <QuestionSection title={qstate.question}></QuestionSection>
            <AnswerSection answers={qstate.answers}
                entry={this.entry}>
            </AnswerSection>
        </div>;
    }
}
