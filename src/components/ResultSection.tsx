import * as React from "react";

export interface ResultProps { result: any; }
export interface ResultState { }

export default class ResultSection extends React.Component<ResultProps, ResultState> {

    constructor(props : ResultProps) {
        super(props);
    }

    public render() {
        return <div className="jumbotron">
            <h2 className="display-3">{this.props.result}</h2>
        </div>;
    }
}
