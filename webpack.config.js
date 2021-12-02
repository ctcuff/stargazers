const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** @type {import('webpack').Configuration} */
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      title: 'CAP 4720 - Final Project'
    })
  ],
  target: 'web',
  entry: path.resolve(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public')
    },
    open: false,
    port: 9000,
    hot: true,
    // Using 0.0.0.0 allows the project to be accessed by all
    // devices on the same network as the host
    host: '0.0.0.0'
  },
  module: {
    rules: [
      {
        test: /\.(js?)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader']
      },
      {
        // Using asset/resource will emit a separate file and export the
        // url. If you want svg to be imported inline, separate svg into a
        // new rule and use asset/inline for (data URI) or asset/source (for code).
        test: /\.(obj)/,
        type: 'asset/inline'
      },
      {
        // Using asset/source will allow these file types to be imported as text.
        test: /\.(fs|vs|frag|vert|glsl)/,
        type: 'asset/source'
      },
      {
        test: /\.(png|jpg|jpeg)$/i,
        type: 'asset/inline'
      }
    ]
  },
  resolve: {
    // Files without an extension will be treated as one of these.
    // Note that webpack will go from left to right until the proper
    // extension is found.
    extensions: ['.js']
  }
};
