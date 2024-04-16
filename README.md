# QTimer

A small program for tracking the execution time of commands.

# Installation

To use, install the executable for your OS:

| OS | FILE | TESTED |
|----|------|--------|
| Windows | [HERE](./dist/win/qtimer.exe)| ✅|
| Linux | [HERE](./dist/linux/qtimer)| ❌ |
| MacOS | [HERE](./dist/macos/qtimer)| ❌ |

After installation, you can transfer the file to `C:/Windows/System32/` on Windows or to `/usr/bin/` or `/bin/` on Linux and MacOS.

# Using

To use, use the command:

`qtimer [command]`

- `[command]` - The command whose time will be measured.

Example:

We have file index.js:
```js
setTimeout(()=>console.log(1), 5000);
```

And we need to find out the time of its execution, to do this we will execute the following command:

```qtimer node ./index.js```

Or:

```qtimer bun run ./index.js```

We will get something like:

```text
░██████╗░████████╗██╗███╗░░░███╗███████╗██████╗░
██╔═══██╗╚══██╔══╝██║████╗░████║██╔════╝██╔══██╗
██║██╗██║░░░██║░░░██║██╔████╔██║█████╗░░██████╔╝
╚██████╔╝░░░██║░░░██║██║╚██╔╝██║██╔══╝░░██╔══██╗
░╚═██╔═╝░░░░██║░░░██║██║░╚═╝░██║███████╗██║░░██║
░░░╚═╝░░░░░░╚═╝░░░╚═╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚═╝

┌──────────────┬──────────────┬──────────┬───────┐
│        start │          end │ exitCode │  time │
├──────────────┼──────────────┼──────────┼───────┤
│ 19:37:52:323 │ 19:37:52:428 │        1 │ 105ml │
└──────────────┴──────────────┴──────────┴───────┘
```