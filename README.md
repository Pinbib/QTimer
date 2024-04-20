# QTimer

A small program for tracking the execution time of commands.

- [QTimer](#qtimer)
    - [Installation](#installation)
    - [Using](#using)
    - [Modes](#modes)
        - [--log](#mode---log)
        - [--count](#mode---count)

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

- `[command]`: String - The command whose time will be measured.

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

## Modes

It is also possible to specify in which mode the command will be launched:

```qtimer [--mode] [command]```

- `[--mode]`: String - this is the mode in which the command will be executed (modes are not combined). There are two modes: [`--log`](#mode---log), [`--count`](#mode---count);

### Mode: --log

If you use this mode, if your command outputs something, you will see it.

Example:

index.js:
```js
setTimeout(()=>console.log(1), 5000);
```

```qtimer --log node index.js```

We will get something like:

```text

░██████╗░████████╗██╗███╗░░░███╗███████╗██████╗░
██╔═══██╗╚══██╔══╝██║████╗░████║██╔════╝██╔══██╗
██║██╗██║░░░██║░░░██║██╔████╔██║█████╗░░██████╔╝
╚██████╔╝░░░██║░░░██║██║╚██╔╝██║██╔══╝░░██╔══██╗
░╚═██╔═╝░░░░██║░░░██║██║░╚═╝░██║███████╗██║░░██║
░░░╚═╝░░░░░░╚═╝░░░╚═╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚═╝

1

┌──────────────┬─────────────┬──────────┬────────┐
│        start │         end │ exitCode │   time │
├──────────────┼─────────────┼──────────┼────────┤
│ 13:48:48:970 │ 13:48:54:65 │        0 │ 5095ml │
└──────────────┴─────────────┴──────────┴────────┘
```

### Mode: --count

Using this mode, you can specify how many times your command will be executed.

```qtimer --count [count] [count]```

- `[count]`: Number - how many times your command will be executed.

Example:

index.js:
```js
setTimeout(()=>console.log(1), 5000);
```

```qtimer --count 3 node index.js```

We will get something like:

```text

░██████╗░████████╗██╗███╗░░░███╗███████╗██████╗░
██╔═══██╗╚══██╔══╝██║████╗░████║██╔════╝██╔══██╗
██║██╗██║░░░██║░░░██║██╔████╔██║█████╗░░██████╔╝
╚██████╔╝░░░██║░░░██║██║╚██╔╝██║██╔══╝░░██╔══██╗
░╚═██╔═╝░░░░██║░░░██║██║░╚═╝░██║███████╗██║░░██║
░░░╚═╝░░░░░░╚═╝░░░╚═╝╚═╝░░░░░╚═╝╚══════╝╚═╝░░╚═╝

┌──────────────┬─────────────┬──────┬─────────┐
│        start │         end │ full │ average │
├──────────────┼─────────────┼──────┼─────────┤
│ 13:55:20:595 │ 13:55:36:64 │  15s │  5147ml │
└──────────────┴─────────────┴──────┴─────────┘
```