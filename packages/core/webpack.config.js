var path = require('path')

module.exports = {
    entry: ["./index", "./ir", "./schema"],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "llqm-core.js",
        library: "llqm-core",
        libraryTarget: "umd"
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: "ts-loader",
            }
        ]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.ts']
    }
}
