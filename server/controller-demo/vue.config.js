'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || '管理系统'
const port = process.env.port || process.env.npm_config_port || 9528

module.exports = {
    publicPath: '/',
    outputDir: '../member-admin-web/src/main/resources/static',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            [process.env.VUE_APP_BASE_API]: {
                target: `http://127.0.0.1:${port}/mock`,
                // target: 'http://127.0.0.1:80',
                bypass: function(req, res, proxyOptions) {

                  // 需要走代理的 mock api 列表(可以只包含前面一部分--表示某一个模块的api全部都需要mock)
                  const mockUrls = [ 
                    /*
                    '/contract/fix/findPage',
                    '/file/task/download/findPage',
                    '/contract/fix/download/findPage',
                    '/file/task/download',
                    '/contract/fix/downloadBatch',
                    */
                  ];
                  const matchedMockUrl = mockUrls.find(mockUrl => req.originalUrl.match(`${process.env.VUE_APP_BASE_API}${mockUrl}`));
                  // 请求的 url 为 mock api，跳过代理，返回mock api的地址
                  if (matchedMockUrl) {
                    console.log('matchedMockUrl: ', matchedMockUrl);
                    return req.originalUrl.replace(process.env.VUE_APP_BASE_API, '/mock'); 
                  }
                },
                changeOrigin: true,
                pathRewrite: {
                  ['^' + process.env.VUE_APP_BASE_API]: ''
                }
            }
        },
        after: require('./src/api/mock-server.js')
    },
    configureWebpack: {
        name: name,
        resolve: {
            alias: {
                '@': resolve('src'),
                '@api': resolve('src/api'),
                '@constant': resolve('src/constant'),
            }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')

        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
              symbolId: 'icon-[name]'
            })
            .end()

      config.module
          .rule('vue')
          .use('vue-loader')
          .loader('vue-loader')
          .tap(options => {
            options.compilerOptions.preserveWhitespace = true
            return options
          })
          .end()

      config
          .when(process.env.NODE_ENV === 'development',
            config => config.devtool('cheap-source-map')
          )

      config
          .when(process.env.NODE_ENV !== 'development',
            config => {
                config
                    .plugin('ScriptExtHtmlWebpackPlugin')
                    .after('html')
                    .use('script-ext-html-webpack-plugin', [{
                        inline: /runtime\..*\.js$/
                    }])
                    .end()
                config
                    .optimization.splitChunks({
                        chunks: 'all',
                        cacheGroups: {
                            libs: {
                                name: 'chunk-libs',
                                test: /[\\/]node_modules[\\/]/,
                                priority: 10,
                                chunks: 'initial'
                            },
                            elementUI: {
                                name: 'chunk-elementUI',
                                priority: 20,
                                test: /[\\/]node_modules[\\/]_?element-ui(.*)/
                            },
                            commons: {
                                name: 'chunk-commons',
                                test: resolve('src/components'),
                                minChunks: 3,
                                priority: 5,
                                reuseExistingChunk: true
                            }
                        }
                    })
                config.optimization.runtimeChunk('single')
            }
          )
    },
    css: {
        loaderOptions: {
            sass: {
                data: '@import "@/styles/rule-variables.scss";'
            }
        }
    }
}
