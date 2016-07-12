import * as React from "react";
import AnswerSection from "./components/AnswerSection";
import QuestionSection from "./components/QuestionSection";
import QAMachine from "./QAMachine";
import EntryStore from "./stores/EntryStore";

import AppDispatcher from './dispatcher/AppDispatcher';
import QAActions from "./actions/QAActions";

interface QAAppProps {
  // Question state
  qState: any;
}

interface QAAppState {
  qState: any;
  currentAnswers: Array<string>;
}

export default class QAApp extends React.Component<QAAppProps, QAAppState> {

    protected machine : any;

    protected entries : EntryStore;

    protected initIdx : number;

    constructor(props : QAAppProps) {
        super(props);
        var m = this.machine = new QAMachine({});
        this.entries = new EntryStore(this.machine);
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
        var initState = this.entries.query([], this.initIdx);
        this.state = {
            "qState": (this.props.qState || initState),
            "currentAnswers": []
        };
    }

    public componentDidMount() :void {
        this.entries.addChangeListener(this.handleChange);
    }

    public componentWillUnmount() :void {
        this.entries.removeChangeListener(this.handleChange);
    }

    public handleChange() {
       // var last = this.entries.query([]);
       // this.setState({"qState" : last} as QAAppState);
    }

    public handleAnswer(key, e) {
        // the key is defined in the current qa state
        if (typeof this.state.qState.answers[key] === "undefined") {
            throw "key " + key + " is not defined in the current answers";
        }
        QAActions.answer(key);
        // this.state.currentAnswers.push(key);
        // this.setState({ "currentAnswers": this.state.currentAnswers.concat([key]) } as QAAppState);
        // var nextIdx = this.state.qState.answers[key];
    }

    public render() {
        var qstate = this.entries.query(this.state.currentAnswers, this.initIdx);
        console.log("qstate", qstate);

        // Use the current answer list to query the last state
        return <div className="jumbotron">
            <QuestionSection title={qstate.question}></QuestionSection>
            <AnswerSection answers={qstate.answers} 
                app={this}
                onAnswer={this.handleAnswer}> </AnswerSection>
        </div>;
    }
}
