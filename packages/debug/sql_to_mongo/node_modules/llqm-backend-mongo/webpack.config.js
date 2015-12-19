var path = require('path')

module.exports = {
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "lib"),
        filename: "llqm-backend-mongo.js",
        library: "llqm-backend-mongo",
        libraryTarget: "umd"
    },
    devtool: "source-map",
    externals: {
        "llqm-core": true
    },
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
