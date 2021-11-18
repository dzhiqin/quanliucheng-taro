const plugin = requirePlugin('healthCardPlugins')

export const healthCardLogin = () => {
  return new Promise ((resolve) => {
    plugin.login((isok, res) => {
      resolve(res)
      }, {
        wechatcode: true
      })
  })
}