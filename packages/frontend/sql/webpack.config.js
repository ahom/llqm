var path = require('path')

module.exports = {
    entry: "./index",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        library: "llqm-frontend-sql",
        libraryTarget: "commonjs"
    },
    externals: [ "llqm-core" ],
    devtool: "source-map"
}
