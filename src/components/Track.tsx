import * as React from "react";

import QAActions from "../actions/QAActions";
import AnswerSection from "./AnswerSection";
import QuestionSection from "./QuestionSection";

interface TrackProps {
    store: any;
    track: number;
}

export default class Track extends React.Component<TrackProps, State> {

    protected store: any;

    protected track: number;

    constructor(props : TrackProps) {
        super(props);
        this.store = this.props.store;
        this.track = this.props.track;
        this.state = this.store.current(this.track);
        console.log(this.track,this.state);
    }

    public handleAnswer(key, e) {
        QAActions.answer(this.track, key);
    }

    public handleBack(e) {
        QAActions.back(this.track);
    }

    public handleChange() {
        var qstate = this.store.current(this.track);
        this.setState(qstate);
    }

    public componentDidMount() : void {
        this.store.addChangeListener(this.handleChange.bind(this));
    }

    public componentWillUnmount() : void {
        this.store.removeChangeListener(this.handleChange.bind(this));
    }

    public render() {
        var qstate = this.store.current(this.track);
        return <div className="jumbotron">
                <QuestionSection title={qstate.question}></QuestionSection>
                <AnswerSection answers={qstate.answers} store={this.store} track={this.track}>
                </AnswerSection>
            </div>
            ;
    }
}
