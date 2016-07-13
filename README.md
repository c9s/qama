QAMA
======

qama is a state machine for Q & A flow, written in TypeScript + React.


SYNOPSIS
--------

```js
var m = new QAMachine({});
var initStateIdx = m.state({
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
            "question": "請回家 XD",
            "payload": { "message": "請回家 XD" },
        })
    }
});
```

INSTALL
-----------

    npm install -g typescript
    npm install -g typings
    npm install -g webpack
    npm install -g webpack-dev-server
    npm install
    npm link typescript
    typings install
    webpack-dev-server


