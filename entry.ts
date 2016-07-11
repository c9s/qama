import * as React from "react";
import * as ReactDOM from "react-dom";
import CurrentEntry from "./components/Question.tsx";
console.clear();

var app = React.createElement(CurrentEntry, { "qState": null });
ReactDOM.render(app, document.getElementById('app'));
