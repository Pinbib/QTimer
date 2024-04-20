'use strict';

var node_child_process = require('node:child_process');
var consoleTablePrinter = require('console-table-printer');

var colorize = {
	rb: (text) => `\x1b[31;1m${text}\x1b[0m`,
	ri: (text) => `\x1b[31;3m${text}\x1b[0m`,
	gb: (text) => `\x1b[32;1m${text}\x1b[0m`,
	gi: (text) => `\x1b[32;3m${text}\x1b[0m`,
	yb: (text) => `\x1b[33;1m${text}\x1b[0m`,
	yi: (text) => `\x1b[33;3m${text}\x1b[0m`,
	bb: (text) => `\x1b[34;1m${text}\x1b[0m`,
	bi: (text) => `\x1b[34;3m${text}\x1b[0m`,
	wb: (text) => `\x1b[37;1m${text}\x1b[0m`,
	wi: (text) => `\x1b[37;3m${text}\x1b[0m`,
	db: (text) => `\x1b[90;1m${text}\x1b[0m`,
	di: (text) => `\x1b[90;3m${text}\x1b[0m`
};

var QTIMER = `\n░██████╗░████████╗██╗███╗░░░███╗███████╗██████╗░\n██╔═══██╗╚══██╔══╝██║████╗░████║██╔════╝██╔══██╗\n██║██╗██║░░░██║░░░██║██╔████╔██║█████╗░░██████╔╝\n╚██████╔╝░░░██║░░░██║██║╚██╔╝██║██╔══╝░░██╔══██╗\n░╚═██╔═╝░░░░██║░░░██║██║░╚═╝░██║███████╗██║░░██║\n░░░╚═╝░░░░░░╚═╝░░░╚═╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚═╝\n`;

console.log(colorize.gi(QTIMER));

let type = undefined;
let command = "";

if (process.argv[2] === "--log") {
    type = "log";
    command = process.argv.slice(3).join(" ");
} else {
    command = process.argv.slice(2).join(" ");
}

function formatTime(time) {
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
}

try {
    function spawn(command, callback) {
        let com = node_child_process.exec(command);
        let info = {};

        com.on("spawn", () => {
            info.start = new Date();
        });

        com.stderr.on("error", (err) => {
            throw new Error("An error occurred.");
        });

        com.on("exit", (code) => {
            info.end = new Date();
            info.exitCode = colorize.yi(code);
            info.time = info.end - info.start;

            info.start = colorize.yi(formatTime(info.start));
            info.end = colorize.yi(formatTime(info.end));

            callback(info);
        });

        if (type === "log") {
            com.stderr.on("data", console.log);
            com.stdout.on("data", console.log);

            // TODO: add input capability
        }
    };

    spawn(command, (info) => {
        info.time = colorize.yb(info.time + "ml");

        consoleTablePrinter.printTable([info]);
    });
} catch (err) {
    if (err) {
        console.log(colorize.rb("An error occurred."));
    }
}
