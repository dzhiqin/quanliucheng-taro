/* eslint-disable no-undef */
import * as Taro from '@tarojs/taro'

Page({
  onLoad(options) {
    this.setData({
      nextPage: options.nextPage || '',
      cardId: options.cardId
    })
  },
  onCancel() {
    Taro.navigateBack()
  },
  authFail() {
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
    let res = data.detail
    Taro.setStorageSync('wechatCode', res.result.wechatCode)
    if(this.data.nextPage){
      Taro.setStorageSync('upgradeCardId',this.data.cardId)
      Taro.navigateBack()
    }else{
      Taro.redirectTo({url: '/pages/card-pack/elec-healthcard-users/elec-healthcard-users'})
    }
  }
})