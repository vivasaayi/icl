// webpack should be in the node_modules directory, install if not.
var webpack = require("webpack");

module.exports = {
  entry: {
    public: './public/js/public.js',
    sm: './public/js/state-machine-ui/ui.js'
  },
  output: {
    path: './public/dist',
    publicPath: '/dist/',
    filename: '[name]bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js*/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loaders: ["style", "css", "sass"]
      },
      {
        test: /\.json/,
        loader: 'json-loader'
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};