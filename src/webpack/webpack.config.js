const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../client'),
  }, plugins: [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/client/template.html',
        //hash: true
    })],
  devServer: {
    contentBase: path.join(__dirname, './src/client'),
    compress: true,
    port: 9000
  }
};