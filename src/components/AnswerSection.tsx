import * as React from "react";

import QAActions from "../actions/QAActions";

interface AnswerProps {
    store: any;
    track: number;
    answers: any;
}

interface AnswerState {
}

export default class AnswerSection extends React.Component<AnswerProps, AnswerState> {

    protected store:any;

    constructor(props : AnswerProps) {
        super(props);
        this.store = this.props.store;
    }

    public handleAnswer(key, e) {
        QAActions.answer(this.props.track, key);
    }

    public handleBack(e) {
        QAActions.back(this.props.track);
    }

    public render() {
        var widgets = [];
        for (let key in this.props.answers) {
            var next = this.props.answers[key];
            widgets.push(" ")
            widgets.push(<button
                         className="btn btn-primary" onClick={this.handleAnswer.bind(this,key)}
                         key={key}>{key}</button>);
        }
        var currentAnswers = this.store.getAnswers(this.props.track);
        return <div>
            {currentAnswers.length == 0 ? null :
                <button className="btn btn-default" onClick={this.handleBack.bind(this)}>回上一題</button>}
            { " " }
            {widgets}
        </div>;
    }
}
