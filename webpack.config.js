const path = require('path')

const outputDirectory = 'public/js'

module.exports = {

    entry: './src/components/App.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, outputDirectory),
    },
    module: {
        rules: [
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /.scss$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },
    devServer: {
        port: 8080,
        open: true,
        proxy: {
            '/': 'http://localhost:80'
        }
    },
}