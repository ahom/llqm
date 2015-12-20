var path = require('path')

module.exports = {
    entry: "./index.js",
    output: {
        path: path.join(__dirname, "lib"),
        filename: "llqm-debug-sql_to_mongo.js",
        library: ["llqm", "debug", "sql_to_mongo"],
        libraryTarget: "umd"
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                loader: "babel",
                exclude: [
                    path.join(__dirname, 'node_modules')
                ],
                query: {
                    presets: [
                        './node_modules/babel-preset-react', 
                        './node_modules/babel-preset-es2015'
                    ]
                }
            }
        ]
    }
}
