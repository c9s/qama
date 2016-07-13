import * as React from "react";

export interface QuestionProps {
    title: string;
}

export interface QuestionState {
}

export default class QuestionSection extends React.Component<QuestionProps, QuestionState> {

    constructor(props : QuestionProps) {
        super(props);
    }

    public render() {
        return <h2 className="display-3">{this.props.title}</h2>;
    }
}
