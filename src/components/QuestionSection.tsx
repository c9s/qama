import * as React from "react";

export interface QuestionProps {
    title: string;
}

export interface QuestionState {
    title: string;
}

export default class QuestionSection extends React.Component<QuestionProps, QuestionState> {
    constructor(props : QuestionProps) {
        super(props);
        this.state = { title: this.props.title };
    }

    render() {
        return <h2 className="display-3">{this.state.title}</h2>;
    }
}
