const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
module.exports = merge(common, {
  mode: "development",
  devServer: {
    static: { directory: path.resolve(__dirname, "dist") },
    port: 3000,
    hot: true,
    compress: true,
    historyApiFallback: true,
    // // axios.get("http://localhost:3000/api/v2/files");
    // proxy: [
    //   {
    //     context: ["/api/v1/*"],
    //     target: "https://192.168.2.103",
    //     pathRewrite: {
    //       "^/api/v1": "",
    //     },
    //     changeOrigin: true,
    //   },
    //   // {
    //   //   context: ["/api/v2/*"],
    //   //   target: "http://192.168.2.103:5000",
    //   //   pathRewrite: {
    //   //     "^/api/v2 ": "",
    //   //   },
    //   //   changeOrigin: true,
    //   // },
    // ],
  },
});
