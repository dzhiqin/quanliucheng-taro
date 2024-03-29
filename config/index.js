import path from 'path'

const config = {
  projectName: 'quanliucheng-react',
  date: '2021-11-8',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: process.env.TARO_ENV === 'weapp' ? 'dist/weapp' : 'dist/alipay',
  plugins: [],
  defineConstants: {
  },
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/pages': path.resolve(__dirname, '..', 'src/pages'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    // '@/package': path.resolve(__dirname, '..', 'package.json'),
    // '@/project': path.resolve(__dirname, '..', 'project.config.json'),
    '@/images': path.resolve(__dirname, '..', 'src/images'),
    '@/custom': path.resolve(__dirname, '..', 'src/custom'),
    '@/service': path.resolve(__dirname, '..', 'src/service'),
    '@/enums': path.resolve(__dirname,'..','src/enums'),
    '@/interfaces': path.resolve(__dirname, '..','src/interfaces')
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'react',
  mini: {
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {

        }
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
