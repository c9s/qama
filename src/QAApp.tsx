import * as React from "react";
// install with `typings install --save npm~history`
import { History, Location, createHistory } from "history";
import * as queryString from "query-string";
import AnswerSection from "./components/AnswerSection";
import QuestionSection from "./components/QuestionSection";
import QAMachine from "./QAMachine";
import EntryStore from "./stores/EntryStore";

import AppDispatcher from './dispatcher/AppDispatcher';

interface QAAppProps {
  // Question state
  qState: any;
}

interface QAAppState {
  qState: any;
}

export default class QAApp extends React.Component<QAAppProps, QAAppState> {

    protected history : History;

    protected unlistenHistory : Function;

    protected machine : any;

    protected entry : EntryStore;

    protected initIdx : number;

    constructor(props : QAAppProps) {
        super(props);
        this.history = createHistory();
        var m = this.machine = new QAMachine({});
        this.initIdx = m.state({
            "question": "Q1 你是勞工嗎？",
            "payload": {},
            "answers": {
                "是": m.state({
                    "question": "Q2 你是領月薪還是時薪呢?",
                    "answers": {
                        "月薪": m.state({
                            "question": "你週六有加班嗎? 加班幾小時?",
                            "answers": {
                                "沒有加班": m.state({
                                    "message": "此次勞基法修法對你沒有影響。"
                                }),
                                "2小時": m.state({
                                    "message": "兩小時內加班，現行是 ⅓ 倍時薪，而一例一休是 1⅓ 倍時薪。"
                                }),
                                "4小時以內": m.state({
                                    "message": "兩小時時薪為 1⅓ 倍時薪，兩小時後工時採 1⅔ 倍時薪計算。 工作時間計算方式為工作4小時以內，以4小時計算"
                                }),
                                "8小時以內": m.state({
                                    "message": "兩小時時薪為 1⅓ 倍時薪，兩小時後工時採 1⅔ 倍時薪計算。 超過4小時至8小時，以8小時計算。"
                                }),
                                "超過八小時": m.state({
                                    "message": "兩小時時薪為 1⅓ 倍時薪，兩小時後工時採 1⅔ 倍時薪計算。 超過8小時至12小時以內者，以12小時計。"
                                })
                            }
                        }),
                        "時薪": null,
                    }
                }),
                "不是": m.state({
                    "question": "請回家 XD",
                    "payload": { "message": "請回家 XD" },
                })
            }
        });
        this.entry = new EntryStore(this.machine, this.initIdx);
        this.state = { "qState": this.entry.current() };
    }

    private handleHistory(location : Location) {
        switch(location.action) {
            case "POP": {
              let query = queryString.parse(location.search);
              let answers = query.answers ? query.answers.split(",") : [];
              this.entry.setAnswers(answers);
              this.setState({ "qState" : this.entry.current() } as QAAppState);
              break;
            }
            default:
        }
    }

    public componentDidMount() :void {
        this.entry.addChangeListener(this.handleChange.bind(this));
        this.unlistenHistory = this.history.listen(this.handleHistory.bind(this));
        // location is global
        this.handleHistory({ "action": "POP", "search": location.search });
    }

    public componentWillUnmount() :void {
        this.entry.removeChangeListener(this.handleChange.bind(this));
        this.unlistenHistory();
        this.unlistenHistory = null;
    }

    public handleChange() {
        var current = this.entry.current();
        var { answers } = this.entry;
        if (answers.length) {
            var query = queryString.stringify({ "answers": answers.join(",") });
            this.history.push({ "pathname": document.location.pathname, "search": "?" + query });
        } else {
            this.history.push({ "pathname": document.location.pathname, "search": "" });
        }
        this.setState({"qState" : current} as QAAppState);
    }

    public render() {
        var qstate = this.state.qState;
        if (!qstate) {
            return <div className="jumbotron"> </div>;
        }

        if (qstate.message) {
            return <div className="jumbotron">
                        {qstate.message}
                    </div>;
        }

        // Use the current answer list to query the last state
        return <div className="jumbotron">
            <QuestionSection title={qstate.question}></QuestionSection>
            <AnswerSection answers={qstate.answers}
                entry={this.entry}>
            </AnswerSection>
        </div>;
    }
}
