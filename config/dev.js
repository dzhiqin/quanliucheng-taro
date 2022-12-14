// eslint-disable-next-line import/no-commonjs
module.exports = { 
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {
    // eslint-disable-next-line no-unused-vars
    webpackChain: (chain, webpack) => {
      chain.merge({
        plugin: {
          install: {
            plugin: require('terser-webpack-plugin'),
            args: [{
              terserOptions: {
                compress: true, // 默认使用terser压缩
                // mangle: false,
                keep_classnames: true, // 不改变class名称
                keep_fnames: true // 不改变函数名称
              }
            }]
          }
        }
      })
    }
  },
  h5: {
    esnextModules: ['taro-ui']
  }
}
