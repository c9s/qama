import * as React from "react";
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

    protected machine : any;

    protected entry : EntryStore;

    protected initIdx : number;

    constructor(props : QAAppProps) {
        super(props);
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

    public componentDidMount() :void {
        this.entry.addChangeListener(this.handleChange.bind(this));
    }

    public componentWillUnmount() :void {
        this.entry.removeChangeListener(this.handleChange.bind(this));
    }

    public handleChange() {
        var current = this.entry.current();
        this.setState({"qState" : current} as QAAppState);
    }

    public render() {
        var qstate = this.state.qState;
        if (!qstate) {
            return <div className="jumbotron"> </div>;
        }
        // Use the current answer list to query the last state
        return <div className="jumbotron">
            <QuestionSection title={qstate.question} entry={this.entry}></QuestionSection>
            <AnswerSection answers={qstate.answers} 
                entry={this.entry}>
            </AnswerSection>
        </div>;
    }
}
