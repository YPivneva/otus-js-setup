const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
// eslint-disable-next-line
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// eslint-disable-next-line
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[hash:8].js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/,
        use: "html-loader",
      },
      {
        test: /\.(png|gif)$/,
        type: "asset/resource",
        generator: {
          filename: "images/[name]-[hash][ext]",
        },
      },
    ],
  },
  devServer: {
    compress: false,
    open: true,
    port: 3000,
    hot: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new HtmlMinimizerPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
    }),
    new CssMinimizerPlugin(),
    new TerserPlugin(),
  ],
};
