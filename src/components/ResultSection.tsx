import * as React from "react";

export interface ResultProps { result: any; }
export interface ResultState { }

export default class ResultSection extends React.Component<ResultProps, ResultState> {

    constructor(props : ResultProps) {
        super(props);
    }

    public render() {
        return <div className="jumbotron">{this.props.result}</div>;
    }
}
