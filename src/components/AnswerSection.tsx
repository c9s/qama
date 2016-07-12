import * as React from "react";

import QAActions from "../actions/QAActions";

interface AnswerProps {
    entry: any;
    answers: any;
}

interface AnswerState {
}

export default class AnswerSection extends React.Component<AnswerProps, AnswerState> {

    protected entry:any;

    constructor(props : AnswerProps) {
        super(props);
        this.entry = this.props.entry;
    }

    public handleAnswer(key, e) {
        QAActions.answer(key);
    }

    public handleBack(e) {
        QAActions.back();
    }

    public render() {
        var widgets = [];
        for (let key in this.props.answers) {
            var next = this.props.answers[key];
            widgets.push(<button
                         className="btn btn-primary" onClick={this.handleAnswer.bind(this,key)}
                         key={key}>{key}</button>);
        }
        var currentAnswers = this.entry.getAnswers();
        return <div>
            {currentAnswers.length == 0 ? null :
                <button className="btn btn-default" onClick={this.handleBack.bind(this)}>回上一題</button>}
            {widgets}
        </div>;
    }
}
