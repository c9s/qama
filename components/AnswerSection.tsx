import * as React from "react";

interface AnswerProps {
    currentEntry: any;
    answers: any;
    onAnswer: any;
}

interface AnswerState {
    answers: any;
}

export default class AnswerSection extends React.Component<AnswerProps, AnswerState> {

    constructor(props : AnswerProps) {
       super(props);
       this.state = { "answers": this.props.answers }
    }

    public render() {
        var widgets = [];
        for (let key in this.state.answers) {
            var next = this.state.answers[key];
            widgets.push(<button 
                         className="btn btn-primary" onClick={this.props.onAnswer.bind(this.props.currentEntry,key)} 
                         key={key}>{key}</button>);
        }
        return <div>{widgets}</div>;
    }
}
