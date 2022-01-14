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
        Taro.redirectTo({url: '/pages/bind-pack/bind-card/bind-card?wechatCode='+res.result.wechatCode})
      })
    }
  },
  addCard(){
    healthCardLogin().then(res => {
      Taro.redirectTo({
        url: '/pages/bind-pack/bind-card/bind-card?wechatCode=' + res.result.wechatCode,
      })
    })
  }
  // pageChange (wechatCode) {
  //   let pages = getCurrentPages()
  //   let routeArr = []
  //   pages.map(item => {
  //     routeArr.push(item.route)
  //   })
  //   if (routeArr[routeArr.length - 1] !== 'pages/personal/personal') {
  //     let loginRouteIndex = routeArr.indexOf('pages/login/login') > 0 ? routeArr.indexOf('pages/login/login') : routeArr.indexOf('pages/login/healthCardAuth')
  //     if (loginRouteIndex >= 0) {
  //       let cardsRoute = routeArr.indexOf('pages/cardsPackage/healthCard/healthCard')
  //       cardsRoute = cardsRoute < 0 ? routeArr.indexOf('pages/cardsPackage/bindCard/bindCard') : cardsRoute
  //       Taro.navigateTo({
  //         url: '../bindCard/bindCard?fromPage=' +(routeArr.length-cardsRoute)+ '&wechatCode=' + wechatCode,
  //       })
  //     } else {
  //       Taro.navigateTo({
  //         url: '../bindCard/bindCard?fromPage=3&wechatCode=' + wechatCode,
  //       })
  //     }
  //   }
  // },
})