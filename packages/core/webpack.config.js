var path = require('path')

module.exports = {
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "lib"),
        filename: "llqm-core.js",
        library: "llqm-core",
        libraryTarget: "umd"
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                include: [
                    __dirname,
                    path.join(__dirname, "src")
                ],
                loader: "babel",
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}
