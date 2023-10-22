const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const INCLUDE_PATTERN = /<include src="(.+)"\s*\/?>(?:<\/include>)?/gi
const processNestedHtml = (content, loaderContext, dir = null) =>
  !INCLUDE_PATTERN.test(content)
    ? content
    : content.replace(INCLUDE_PATTERN, (src) => {
        const filePath = path.resolve(dir || loaderContext.context, src)
        loaderContext.addDependency(filePath)
        return processNestedHtml(
          loaderContext.fs.readFileSync(filePath, 'utf8'),
          loaderContext,
          path.dirname(filePath)
        )
      })

// HTML generation
const paths = []
const generateHTMLPlugins = () =>
  glob.sync('./src/*.html').map((dir) => {
    const filename = path.basename(dir)

    if (filename !== '404.html') {
      paths.push(filename)
    }

    return new HtmlWebpackPlugin({
      filename,
      template: path.join('./src', filename),
      favicon: `./src/images/favicon.ico`,
      inject: 'body',
    })
  })

module.exports = {
  mode: 'development',
  entry: {
    bundle:path.resolve(__dirname, './src/js/index.js')
 },
 output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name][contenthash].js',
    clean:true,
    assetModuleFilename: '[name][ext]',
 },
 devtool:'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port:3000,
    open:true,
    hot:true,
    compress:true,
    historyApiFallback:true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                'prismjs',
                {
                  languages: ['javascript', 'css', 'markup'],
                  plugins: ['copy-to-clipboard'],
                  css: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('autoprefixer')({
                    overrideBrowserslist: ['last 2 versions'],
                  }),
                ],
              },
            },
          },
        ],
      },
      {
        test:/\.scss$/,
            use:[
                'style-loader',
                'css-loader',
                'sass-loader',
            ],
        },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          preprocessor: processNestedHtml,
        },
      },
    ],
  },
  plugins: [
    ...generateHTMLPlugins(),
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: 'style.css',
    }),
  ],
  target: 'web', // fix for "browserslist" error message
  stats: 'errors-only', // suppress irrelevant log messages
}