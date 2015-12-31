var path = require('path')

module.exports = {
    entry: "./index",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "llqm-backend-mongo.js",
        library: "llqm-backend-mongo",
        libraryTarget: "umd"
    },
    externals: [ "llqm-core" ],
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
