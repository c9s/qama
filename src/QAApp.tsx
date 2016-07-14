import * as React from "react";
// install with `typings install --save npm~history`
import { History, Location, createHistory } from "history";
import * as queryString from "query-string";
import Track from "./components/Track";
import QAMachine from "./QAMachine";
import EntryStore from "./stores/EntryStore";

import AppDispatcher from './dispatcher/AppDispatcher';

interface QAAppProps { }
interface QAAppState { }

export default class QAApp extends React.Component<QAAppProps, QAAppState> {

    protected history : History;

    protected unlistenHistory : Function;

    protected machine : any;

    protected store : EntryStore;

    protected tracks: Array<number>;

    constructor(props : QAAppProps) {
        super(props);
        this.tracks = [];
        this.history = createHistory();
        var m = this.machine = new QAMachine({});


        this.tracks.push(m.state({
            "title": "Q1 國定假日有上班嗎？",
            "answers": {
                "有": m.state({ "result": "你沒差" }),
                "沒有": m.state({ "result": "你少七天假" })
            }
        }));

        this.tracks.push(m.state({
            "title": "Q2 你是勞工嗎？",
            "answers": {
                "是": m.state({
                    "title": "你是領月薪還是時薪呢?",
                    "answers": {
                        "月薪": m.state({
                            "title": "你週六有加班嗎? 加班幾小時?",
                            "answers": {
                                "沒有加班": m.state({
                                    "result": "此次勞基法修法對你沒有影響。"
                                }),
                                "2小時": m.state({
                                    "result": "兩小時內加班，現行是 ⅓ 倍時薪，而一例一休是 1⅓ 倍時薪。"
                                }),
                                "4小時以內": m.state({
                                    "result": "兩小時時薪為 1⅓ 倍時薪，兩小時後工時採 1⅔ 倍時薪計算。 工作時間計算方式為工作4小時以內，以4小時計算"
                                }),
                                "8小時以內": m.state({
                                    "result": "兩小時時薪為 1⅓ 倍時薪，兩小時後工時採 1⅔ 倍時薪計算。 超過4小時至8小時，以8小時計算。"
                                }),
                                "超過八小時": m.state({
                                    "result": "兩小時時薪為 1⅓ 倍時薪，兩小時後工時採 1⅔ 倍時薪計算。 超過8小時至12小時以內者，以12小時計。"
                                })
                            }
                        }),
                        "時薪": null,
                    }
                }),
                "不是": m.state({
                    "title": "請回家 XD",
                    "payload": { "result": "請回家 XD" },
                })
            }
        }));
        console.log("tracks",this.tracks);
        this.store = new EntryStore(this.machine);
    }

    private handleHistory(location : Location) {
        switch (location.action) {
            case "POP": {
                this.store.loadQueryString(location.search);
                break;
            }
            default:
        }
    }

    public componentDidMount() : void {
        this.store.addChangeListener(this.handleChange.bind(this));
        this.unlistenHistory = this.history.listen(this.handleHistory.bind(this));
        // location is global
        this.handleHistory({ "action": "POP", "search": location.search });
    }

    public componentWillUnmount() : void {
        this.store.removeChangeListener(this.handleChange.bind(this));
        this.unlistenHistory();
        this.unlistenHistory = null;
    }

    public handleChange() {
        var qs = this.store.serialize();
        console.log(qs);
        this.history.push({
            "pathname": document.location.pathname,
            "search": qs ? ("?" + qs) : ""
        });
    }

    public render() {
        var trackComponents = [];
        this.tracks.forEach((tid,i) => {
            trackComponents.push(
                <Track key={i} track={tid} store={this.store}>
                </Track>
            );
        });
        return <div>{trackComponents}</div>;
    }
}
