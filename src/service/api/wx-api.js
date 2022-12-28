export const healthCardLogin = () => {
  if(process.env.TARO_ENV === 'weapp'){
    // eslint-disable-next-line no-undef
    const plugin = requirePlugin('healthCardPlugins')
    return new Promise ((resolve) => {
    plugin.login((isok, res) => {
      resolve(res)
      }, {
        wechatcode: true
      })
    })
  }
}