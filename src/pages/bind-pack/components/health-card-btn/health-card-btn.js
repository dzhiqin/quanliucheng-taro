/* eslint-disable no-undef */
const plugin = requirePlugin('healthCardPlugins')

Component({
  methods: {
    loginHeath () {
      plugin.login((isok, res) => {
        this.triggerEvent('login', res)
      }, {
        wechatcode: true
      })
    }
  }
})