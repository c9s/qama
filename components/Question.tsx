import * as React from "react";
import AnswerSection from "./AnswerSection";
import QuestionSection from "./QuestionSection";
import QAMachine from "../qamachine";
import EntryStore from "../stores/EntryStore";

interface CurrentEntryProps {
  // Question state
  qState: any;
}

interface CurrentEntryState {
  qState: any;
}

export default class CurrentEntry extends React.Component<CurrentEntryProps, CurrentEntryState> {

    protected machine : any;

    protected entries : EntryStore;

    constructor(props : CurrentEntryProps) {
        super(props);
        this.state = { qState: this.props.qState };
        this.machine = new QAMachine({});
        this.entries = new EntryStore(this.machine);
    }

   public componentDidMount() :void {
        this.entries.addChangeListener(this.handleChange);
   }

   public componentWillUnmount() :void {
        this.entries.removeChangeListener(this.handleChange);
   }

   public handleChange() {
       var last = this.entries.query([], "Q1");
       this.setState({ "qState": last });
   }

   public handleAnswer(key, e) {
       console.log(this, key, e);
   }

   public render() {
     return <div className="jumbotron">
        <QuestionSection title={this.state.qState.question}></QuestionSection>
        <AnswerSection answers={this.state.qState.answers} 
            currentEntry={this}
            onAnswer={this.handleAnswer}> </AnswerSection>
     </div>;
   }
}
