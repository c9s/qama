import * as React from "react";

import QAActions from "../actions/QAActions";
import AnswerSection from "./AnswerSection";
import QuestionSection from "./QuestionSection";
import ResultSection from "./ResultSection";

interface TrackProps {
    store: any;
    track: number;
}

export default class Track extends React.Component<TrackProps, QAState> {

    protected store: any;

    constructor(props : TrackProps) {
        super(props);
        this.store = this.props.store;
        this.state = this.store.current(this.props.track);
    }

    public handleAnswer(key, e) {
        QAActions.answer(this.props.track, key);
    }

    public handleBack(e) {
        QAActions.back(this.props.track);
    }

    public handleChange() {
        var qstate = this.store.current(this.props.track);
        this.setState(qstate);
    }

    public componentDidMount() : void {
        this.store.addChangeListener(this.handleChange.bind(this));
    }

    public componentWillUnmount() : void {
        this.store.removeChangeListener(this.handleChange.bind(this));
    }

    public render() {
        var qstate = this.store.current(this.props.track);

        // TODO: extract to Result component
        if (qstate.result) {
            return <ResultSection result={qstate.result}></ResultSection>;
        }

        // render result
        return <div className="jumbotron">
                <QuestionSection title={qstate.title}></QuestionSection>
                <AnswerSection 
                        answers={qstate.answers} 
                        store={this.store} 
                        track={this.props.track}>
                </AnswerSection>
            </div>
            ;
    }
}
