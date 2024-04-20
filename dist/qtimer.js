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
        let count = Number(process.argv[3]);
        if (!isNaN(count)) {
            config.count = count;
            command = process.argv.slice(4).join(" ");
        } else throw new Error();
    } catch (err) {
        if (err) {
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

    if (unit && !isNaN(amount)) {
        return `${amount}${unit}`;
    } else {
        return `${milliseconds}ml`;
    }
}

try {
    if (!command) throw new Error();

    function spawn(command) {
        return new Promise((resolve, reject) => {
            let com = node_child_process.exec(command);
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

            consoleTablePrinter.printTable([info]);
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

            consoleTablePrinter.printTable([info]);
        })();
    }
} catch (err) {
    if (err) {
        console.log(colorize.rb("An error occurred."));
    }
}
