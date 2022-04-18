const { loaderByName } = require("@craco/craco");
const CracoLessPlugin = require('craco-less')
const path = require('path')
const lessModuleRegex = /\.module\.less$/;

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve('src')
    }
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
        modifyLessModuleRule: (lessModuleRule, context) => {
          lessModuleRule.test = lessModuleRegex;
          lessModuleRule.exclude = /node_modules|antd.*?\.css/;
          const cssLoader = lessModuleRule.use.find(loaderByName("css-loader"));
          cssLoader.options.modules = {
            localIdentName: "[local]_[hash:base64:5]"
          }
          return lessModuleRule;
        },
      },
    },
  ],
}