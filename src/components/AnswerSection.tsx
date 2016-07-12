import * as React from "react";

import QAActions from "../actions/QAActions";

interface AnswerProps {
    entry: any;
    answers: any;
}

interface AnswerState {
    answers: any;
}

export default class AnswerSection extends React.Component<AnswerProps, AnswerState> {

    protected entry:any;

    constructor(props : AnswerProps) {
        super(props);
        this.state = { "answers": this.props.answers }
        this.entry = this.props.entry;
    }

    public componentDidMount() :void {
        this.entry.addChangeListener(this.handleChange.bind(this));
    }

    public componentWillUnmount() :void {
        this.entry.removeChangeListener(this.handleChange.bind(this));
    }

    public handleChange() {
        var cur = this.entry.current();
        if (cur) {
            this.setState({ "answers": cur.answers } as AnswerState);
        }
    }

    public handleAnswer(key, e) {
        QAActions.answer(key);
    }

    public handleBack(e) {
        QAActions.back();
    }

    public render() {
        var widgets = [];
        for (let key in this.state.answers) {
            var next = this.state.answers[key];
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
