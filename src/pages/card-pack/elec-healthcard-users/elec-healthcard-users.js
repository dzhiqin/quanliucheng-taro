/* eslint-disable no-undef */
import { healthCardLogin } from '@/service/api'
import * as Taro from '@tarojs/taro'

Page({
  data: {
    toPage: '',
    fromPage: ''
  },
  onload(options) {
    this.setData({
      fromPage: options.page || '',
      toPage: options.back || ''
    })
  },
  selectCallback(result){
    let data = result.detail || {}
    if(data.healthCode){
      Taro.setStorageSync('healthCode', data.healthCode)
      healthCardLogin().then(res => {
        Taro.redirectTo({url: '/pages/card-pack/create-card/create-card?wechatCode='+res.result.wechatCode})
      })
    }
  },
  addCard(){
    healthCardLogin().then(res => {
      Taro.redirectTo({
        url: '/pages/card-pack/create-card/create-card?wechatCode=' + res.result.wechatCode,
      })
    })
  }
})