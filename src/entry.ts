import * as React from "react";
import * as ReactDOM from "react-dom";
import QAApp from "./QAApp.tsx";
console.clear();
var app = React.createElement(QAApp, { "qState": null });
ReactDOM.render(app, document.getElementById('app'));
