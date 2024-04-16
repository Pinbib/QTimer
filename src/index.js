import colorize from "qp-color";
import { exec } from "node:child_process";
import { printTable } from "console-table-printer";
import QTIMER from "./QTIMER.js";

console.log(colorize.gi(QTIMER));

let command = process.argv.slice(2).join(" ");

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
    };

    // spawn(command, (info1) => {
    //     spawn(command, (info2) => {
    //         spawn(command, (info3) => {
    //             let average = Math.round((info1.time + info2.time + info3.time) / 3);

    //             info1.time = colorize.yb(info1.time + "ml");
    //             info2.time = colorize.yb(info2.time + "ml");
    //             info3.time = colorize.yb(info3.time + "ml");

    //             printTable([
    //                 info1, info2, info3,
    //                 { start: colorize.yb("Average"), end: colorize.yb("Time"), exitCode: colorize.yi("0"), time: colorize.yb(average + "ml") }
    //             ])
    //         });
    //     });
    // });

    spawn(command, (info) => {
        info.time = colorize.yb(info.time + "ml");

        printTable([info]);
    });
} catch (err) {
    if (err) {
        console.log(colorize.rb("An error occurred."));
    }
}