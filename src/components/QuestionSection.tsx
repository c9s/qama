import * as React from "react";

export interface QuestionProps {
    entry: any;
    title: string;
}

export interface QuestionState {
    title: string;
}

export default class QuestionSection extends React.Component<QuestionProps, QuestionState> {

    protected entry:any;

    constructor(props : QuestionProps) {
        super(props);
        this.entry = this.props.entry;
        this.state = { 'title': this.props.title };
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
            this.setState({ "title": cur.question } as QuestionState);
        }
    }

    public render() {
        return <h2 className="display-3">{this.state.title}</h2>;
    }
}
