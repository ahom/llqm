var path = require('path')

module.exports = {
    entry: "./lib/src/boot",
    output: {
        path: path.join(__dirname, "lib"),
        filename: "bundle.js",
        library: "llqm-debug-sql_to_mongo",
        libraryTarget: "umd"
    },
    devtool: "source-map"
}
