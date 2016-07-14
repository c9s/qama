import * as React from "react";

export interface QuestionProps {
    title: string;
    subtitle?: string;
}

export interface QuestionState {
}

export default class QuestionSection extends React.Component<QuestionProps, QuestionState> {

    constructor(props : QuestionProps) {
        super(props);
    }

    public render() {
        var comps = [<h2 key={"title"} className="display-3">{this.props.title}</h2>];
        if (this.props.subtitle) {
            comps.push(<p className="lead">{this.props.subtitle}</p>);
        }
        return <div>{comps}</div>;
    }
}
