/* eslint-disable no-undef */
Page({
  onLoad(options) {
    this.setData({toPage: options.page || ''})
  },
  onCancel() {
    wx.navigateBack()
  },
  authFail() {
    console.log('auth faile');
    wx.showToast({
      title: '授权失败！',
    })
  },
  authCancel() {
    wx.showToast({
      title: '取消授权！',
    })
  },
  authSuccess(data) {
    let res = data.detail
    wx.setStorageSync('wechatCode', res.result.wechatCode)
    if(this.data.toPage === 'cards'){
      wx.navigateTo({
        url: '/pages/elec-healthcard-users/elec-healthcard-users?back=2',
      })
    }else{
      wx.navigateTo({
        url: '/pages/bind-card/bind-card?wechatCode=' + res.result.wechatCode,
      })
    }
  }
})