import { nodeResolve } from "@rollup/plugin-node-resolve"

export default {
    input: "./src/index.js",
    output: {
        file: "./dist/qtimer.js",
        format: "cjs"
    },
    external: ["console-table-printer"],
    plugins: [nodeResolve()]
}