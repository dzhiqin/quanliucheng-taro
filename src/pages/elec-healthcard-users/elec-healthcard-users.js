/* eslint-disable no-undef */
import { healthCardLogin } from '../../service/api/wx-api'

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
      wx.setStorageSync('healthCode', data.healthCode)
    }
    if (this.data.fromPage) {
      healthCardLogin().then(res => {
        wx.navigateTo({
          url: '../bindCard/bindCard?fromPage=2&wechatCode=' + res.result.wechatCode,
        })
      })
    }else{
      if (!this.data.toPage) {
        wx.navigateBack({
          delta: 1,
        })
        return
      }
      healthCardLogin().then(res => {
        // this.pageChange(res.result.wechatCode)
      })
    }
  },
  addCard(){
    healthCardLogin().then(res => {
      wx.navigateTo({
        url: '../bindCard/bindCard?wechatCode=' + res.result.wechatCode,
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
  //       wx.navigateTo({
  //         url: '../bindCard/bindCard?fromPage=' +(routeArr.length-cardsRoute)+ '&wechatCode=' + wechatCode,
  //       })
  //     } else {
  //       wx.navigateTo({
  //         url: '../bindCard/bindCard?fromPage=3&wechatCode=' + wechatCode,
  //       })
  //     }
  //   }
  // },
})