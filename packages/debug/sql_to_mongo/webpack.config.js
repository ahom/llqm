var path = require('path')

module.exports = {
    entry: "./src/boot",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        library: "llqm-debug-sql_to_mongo",
        libraryTarget: "commonjs"
    },
    devtool: "source-map"
}
