const path = require('path')
const CracoLessPlugin = require('craco-less')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { BannerPlugin } = require('webpack')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

const lessModuleRegex = /\.module\.less$/;

module.exports = {
  webpack: {
    alias: {
      "@": path.resolve('src'),
      '@ant-design/icons/lib/dist$': path.resolve(__dirname, './src/utils/icons.ts'),
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true
          }
        }
      }
    },
    plugins: [
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'react',
            entry:
              'https://unpkg.com/react@18/umd/react.production.min.js',
            global: 'React',
          },
          {
            module: 'react-dom',
            entry:
              'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
            global: 'ReactDOM',
          },
          {
            module: 'lodash',
            entry:
              'https://unpkg.com/lodash@4/lodash.min.js',
            global: '_',
          },
          {
            module: 'moment',
            entry: 'https://unpkg.com/moment@2/moment.js',
            global: 'moment',
          },
          {
            module: 'immer',
            entry:
              'https://unpkg.com/immer@9.0.1/dist/immer.umd.production.min.js',
            global: 'immer',
          },
          {
            module: 'antd',
            entry: 'https://unpkg.com/antd@4/dist/antd.min.js',
            global: 'antd',
          },
          {
            module: '@ant-design/icons',
            entry:
              'https://unpkg.com/@ant-design/icons@4/dist/index.umd.js',
            global: 'icons',
          },
        ]
      }),
      new BannerPlugin(`mumu-page v1.0.0
Copyright 2021-2022 the original author or authors.
Licensed under the Apache License, Version 2.0 (the 'License');`),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false, // 构建完打开浏览器
        reportFilename: path.resolve(__dirname, `build/analyzer.html`),
      })
    ],
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
          return lessModuleRule;
        },
      },
    },
  ],
  babel: {
    plugins: [
      [
        "import",
        {
          "libraryName": "antd",
          "libraryDirectory": "es",
          "style": "css" //设置为true即是less 这里用的是css
        }
      ]
    ]
  },
}