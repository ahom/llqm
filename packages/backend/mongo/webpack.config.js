var path = require('path')

module.exports = {
    entry: "./index",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        library: "llqm-backend-mongo",
        libraryTarget: "commonjs"
    },
    devtool: "source-map",
    externals: ["llqm-core"]
}
