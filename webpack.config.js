const path = require('path')
const webpack = require('webpack')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin')

// 是否为开发模式
const isDev = process.env.NODE_ENV === 'dev'

// 路径转换
function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

// webpack 基础配置
const config = {
  // 入口
  entry: resolve('src/index.jsx'),
  // 输出
  output: {
    path: resolve('dist'),
    filename: '[name].[hash:6].js'
  },
  // 解析
  resolve: {
    // 自动解析确定的扩展
    extensions: ['.js', '.jsx', '.styl'],
    // 创建 import 或 require 的别名
    alias: {
      '@': resolve('src'),
      '@assets': resolve('src/assets'),
      '@images': resolve('src/assets/images'),
      '@styles': resolve('src/assets/styles'),
      '@views': resolve('src/views'),
      '@components': resolve('src/components')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        // 排除node_modules目录
        exclude: /node_modules/
      }, {
        test: /\.jsx$/,
        use: 'babel-loader',
        // 排除node_modules目录
        exclude: /node_modules/
      }, {
        test: /\.(gif|jpg|jpeg|png|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            // 资源文件小于1024直接转成base64
            limit: 1024,
            name: 'static/[name].[hash:6].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // webpack编译过程中和自己写的js中调用
      // 生产打包时必须包含production，否则Chrome React Developer Tools一直为红色
      'process.env': {
        NODE_ENV: isDev ? '"development"' : '"production"'
      }
    }),
    // 自动生成一个html文件、引入相关静态资源、bundle.js等功能
    new HTMLWebpackPlugin({
      // 标题
      title: 'React_basic',
      // 模版
      template: resolve('src/tpl/index.html'),
      // 给定的图标路径，可将其添加到输出html中
      favicon: resolve('src/assets/favicon.ico')
    })
  ]
}

// 开发模式和生产模式相关配置
if (isDev) {
  config.entry = [
    'react-hot-loader/patch',
    resolve('src/index.jsx')
  ]
  // 开发中如果使用css文件，需以下配置
  config.module.rules.push({
    test: /\.css$/,
    use: ['style-loader', 'css-loader', {
      loader: 'postcss-loader',
      options: {
        sourceMap: true
      }
    }]
  })
  // 开发环境stylus配置
  config.module.rules.push({
    test: /\.styl$/,
    // loader处理后依次往上处理
    use: ['style-loader', 'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      }, 'stylus-loader'
    ]
  })
  // 使用source-map便于调试
  config.devtool = '#cheap-module-eval-source-map'
  // 配置devServer
  config.devServer = {
    // 端口
    port: 8001,
    // 本机内外网ip可访问
    host: '0.0.0.0',
    overlay: {
      // 报错信息显示到网页
      errors: true
    },
    // 不刷新页面重新渲染节点(模块热替换)
    hot: true,
    // 自动打开浏览器
    //open: true
  }
  config.plugins.push(
    // 模块热替换
    new webpack.HotModuleReplacementPlugin(),
    // 编译出现错误时跳过输出阶段，确保输出资源不会包含错误
    new webpack.NoEmitOnErrorsPlugin()
  )
} else {
  // 生产环境配置
  // 配置单独打包依赖js库
  config.entry = {
    app: resolve('src/index.jsx'),
    // 此处vendor和下面CommonsChunkPlugin中的name相同
    vendor: ['react', 'react-dom']
  }
  // 生产环境输出的js名称
  config.output.filename = '[name].[chunkhash:6].js'
  // 生产中将css提取
  config.module.rules.push({
    test: /\.css$/,
    // loader处理后依次往上处理，最后打包成css文件
    use: ExtractTextWebpackPlugin.extract({
      fallback: 'style-loader',
      use: [{
        loader: 'css-loader',
        options: {
          // css压缩
          minimize: true
        }
      }, 'postcss-loader']
    })
  })
  // 生产环境stylus配置
  config.module.rules.push({
    test: /\.styl$/,
    // loader处理后依次往上处理，最后打包成css文件
    use: ExtractTextWebpackPlugin.extract({
      fallback: 'style-loader',
      use: [{
        loader: 'css-loader',
        options: {
          // css压缩
          minimize: true
        }
      }, 'postcss-loader', 'stylus-loader']
    })
  })
  config.plugins.push(
    // 单独打包css的文件名，带有8为hash值
    new ExtractTextWebpackPlugin('styles.[contentHash:6].css'),
    // 公共代码分离打包
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'mainifest']
    }),
    // 混淆相关
    new webpack.optimize.UglifyJsPlugin({
      // 压缩
      compress: {
        // 取消警告
        warnings: false
      },
      // 是否生成sourceMap
      sourceMap: false
    })
  )
}

module.exports = config
