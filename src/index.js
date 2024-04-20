import colorize from "qp-color";
import { exec } from "node:child_process";
import { printTable } from "console-table-printer";
import QTIMER from "./QTIMER.js";

console.log(colorize.gi(QTIMER));

let mode = undefined;
let type = undefined;
let config = {};
let command = "";

if (process.argv[2] === "--log") {
    mode = "log";
    command = process.argv.slice(3).join(" ");
} else if (process.argv[2] === "--count") {
    try {
        type = "count";
        config.count = Number(process.argv[3]);

        command = process.argv.slice(4).join(" ");
    } catch (err) {
        if (err) {
            console.log(colorize.rb("An error occurred."));
            type = undefined;
        }
    }
} else {
    command = process.argv.slice(2).join(" ");
}

function formatTime(time) {
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
}

function convertTimeUnit(milliseconds) {
    if (milliseconds < 0 || isNaN(milliseconds)) {
        return "NaN";
    }

    if (milliseconds === 0) {
        return "0ml";
    }

    const coefficients = {
        h: 1000 * 60 * 60,
        m: 1000 * 60,
        s: 1000
    };

    const unit = Object.keys(coefficients).find(unit => milliseconds >= coefficients[unit]);

    const amount = Math.floor(milliseconds / coefficients[unit]);

    return `${amount}${unit}`;
}

try {
    function spawn(command) {
        return new Promise((resolve, reject) => {
            let com = exec(command);
            let info = {};

            com.on("spawn", () => {
                info.start = new Date();
            });

            com.stderr.on("error", (err) => {
                reject(new Error("An error occurred."));
            });

            com.on("exit", (code) => {
                info.end = new Date();
                info.exitCode = colorize.yi(code);
                info.time = info.end - info.start;

                info.start = colorize.yi(formatTime(info.start));
                info.end = colorize.yi(formatTime(info.end));

                resolve(info);
            });

            if (mode === "log") {
                com.stderr.on("data", console.log);
                com.stdout.on("data", console.log);

                // TODO: add input capability
            }
        });
    };

    if (!type) {
        spawn(command).then((info) => {
            info.time = colorize.yb(info.time + "ml");

            printTable([info]);
        }).catch((err) => {
            throw err;
        });
    } else if (type === "count") {
        (async () => {
            let info = {
                start: new Date()
            };

            let infs = [];

            for (let i = 0; i < config.count; i++) {
                infs.push(await spawn(command));
            }

            info.end = new Date();

            info.full = colorize.yb(convertTimeUnit(info.end - info.start));

            let average = 0;

            infs.forEach(val => {
                average += val.time;
            });

            info.average = colorize.yb(Math.round(average / infs.length) + "ml");

            info.start = colorize.yi(formatTime(info.start));
            info.end = colorize.yi(formatTime(info.end));

            printTable([info]);
        })();
    }
} catch (err) {
    if (err) {
        console.log(colorize.rb("An error occurred."));
    }
}