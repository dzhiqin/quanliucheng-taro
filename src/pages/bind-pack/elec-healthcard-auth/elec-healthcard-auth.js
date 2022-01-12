/* eslint-disable no-undef */
import * as Taro from '@tarojs/taro'

Page({
  onLoad(options) {
    this.setData({toPage: options.page || ''})
  },
  onCancel() {
    Taro.navigateBack()
  },
  authFail() {
    console.log('auth faile');
    Taro.showToast({
      title: '授权失败！',
    })
  },
  authCancel() {
    Taro.showToast({
      title: '取消授权！',
    })
  },
  authSuccess(data) {
    console.log('authsuccess',data);
    let res = data.detail
    Taro.setStorageSync('wechatCode', res.result.wechatCode)
    // if(this.data.toPage === 'cards'){
    //   Taro.navigateTo({
    //     url: '/pages/bind-pack/elec-healthcard-users/elec-healthcard-users?back=2',
    //   })
    // }else{
    //   Taro.navigateTo({
    //     url: '/pages/bind-pack/bind-card/bind-card?wechatCode=' + res.result.wechatCode,
    //   })
    // }
    Taro.navigateTo({url: '/pages/bind-pack/elec-healthcard-users/elec-healthcard-users'})
  }
})