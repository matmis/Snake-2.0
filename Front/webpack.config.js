const webpack = require("webpack"),
path = require("path"),
cleanWebpackPlugin = require("clean-webpack-plugin"),
extractPlugin = require("extract-text-webpack-plugin");

module.exports = {
entry: ['./src/js/app.js', './src/scss/app.scss'],
output:{
    path: path.resolve(__dirname, '../Back/dist/js'),
    filename: 'app.bundle.js'
},
plugins: [
    new cleanWebpackPlugin('[../Back/dist/js]'),
    new extractPlugin({
        filename: '../css/app.css',
        allChunks: true
    })
],
module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
          test: /\.scss$/,
          loader: extractPlugin.extract(['css-loader', 'sass-loader'])
      }
    ]
}
}