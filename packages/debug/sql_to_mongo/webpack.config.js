var path = require('path')

module.exports = {
    entry: "./src/boot",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "llqm-debug-sql_to_mongo.js",
        library: "llqm-debug-sql_to_mongo",
        libraryTarget: "umd"
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            }
        ]
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx']
    }
}
