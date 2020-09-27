const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: './app/index.tsx',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./app/static/index.html",
      filename: "./index.html"
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
};