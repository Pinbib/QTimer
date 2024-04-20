import colorize from "qp-color";
import { exec } from "node:child_process";
import { printTable } from "console-table-printer";
import QTIMER from "./QTIMER.js";

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
        let com = exec(command);
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

        printTable([info]);
    });
} catch (err) {
    if (err) {
        console.log(colorize.rb("An error occurred."));
    }
}