const webpack = require('webpack');
// const path = require('path')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin //Webpack包文件分析器
// const CompressionPlugin = require('compression-webpack-plugin') //Gzip

// function resolve(dir) {
//   return path.join(__dirname, dir)
// }
// 引入等比适配插件
const px2rem = require('postcss-px2rem')

// 配置基本大小
const postcss = px2rem({
  // 基准大小 baseSize，需要和rem.js中相同
  remUnit: 16
})
module.exports = {
    lintOnSave: true,
    publicPath: './', // 部署项目路径
    // baseUrl: process.env_NODE_ENV == 'production' ? '/vehiclerepair/' : '', // 部署项目路径
    devServer: {
        port: 8086, // 端口号
        // host: '10.1.',
        open: false, // 配置自动启动浏览器
        proxy: {
            '/auditkindness': {
                target: 'http://47.100.200.255:19977/auditkindness',  // 测试
                changeOrigin: true,
                pathRewrite: {
                    '^/auditkindness': '/'
                }
            }
        }
    },
    configureWebpack: {
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery",
                "windows.jQuery": "jquery"
            })
        ]
    },
    css: {
    //     loaderOptions: {
    //         sass: {
    //             // data: `@import "@/assets/css/global.scss";`
    //             prependData: `@import "~@/assets/css/global.scss";`
    //         }
    //     }
        loaderOptions: {
            postcss: {
                plugins: [
                    postcss
                ]
            }
        }
    }
};
