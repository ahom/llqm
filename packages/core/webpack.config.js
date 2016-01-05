var path = require('path')

module.exports = {
    entry: "./index",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        library: "llqm-core",
        libraryTarget: "commonjs"
    },
    devtool: "source-map"
}
