const webpack = require("webpack"),
      path = require("path"),
      cleanWebpackPlugin = require("clean-webpack-plugin"),
      extractPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: ['./src/js/QuizFinished.js'],
  //entry: ['./src/js/Index.js'],
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: "QuizFinished.bundle.js"
    //filename: "app.bundle.js"
  },
  plugins: [
    new cleanWebpackPlugin('[dist/js]'),
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
      }
    ]
  }
};
