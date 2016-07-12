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
        var m = this.machine = new QAMachine({});
        this.entries = new EntryStore(this.machine);
        var initIdx = m.state({
            "question": "Q1 你是勞工嗎？",
            "payload": {},
            "answers": {
                "是": m.state({
                    "question": "Q2 你是領...",
                    "answers": {
                        "月薪": null,
                        "時薪": null,
                    }
                }),
                "不是": m.state({
                    "payload": { "message": "請回家 XD" },
                })
            }
        });
        var initState = this.entries.query([], initIdx);
        this.state = { qState: this.props.qState || initState };
    }

   public componentDidMount() :void {
        this.entries.addChangeListener(this.handleChange);
   }

   public componentWillUnmount() :void {
        this.entries.removeChangeListener(this.handleChange);
   }

   public handleChange() {
       var last = this.entries.query([]);
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
