// const app = getApp()
// const { unique } = require('./util')
// import {cardSetDefault} from './WX_api'
export default {
  add: ()=> {
    // app.globalData.userCards = [cardInfo, ...app.globalData.userCards]
    // app.globalData.userCards = unique(app.globalData.userCards, 'id') // 数组去重
    // if (cardInfo.isDefault) {
    //   this.setDefaultCard(cardInfo.id)
    //   this.selectCard(cardInfo.id)
    // } else if (app.globalData.userCards.length == 1) {
    //   this.setDefaultCard(cardInfo.id)
    //   cardSetDefault(cardInfo.id).then(res => {
    //   })
    // }
    // wx.setStorageSync('cards', app.globalData.userCards)
  },
  delete: (cardId)=> {
    // app.globalData.userCards = app.globalData.userCards.filter(item => {
    //   return item.id != cardId
    // })
    // wx.setStorageSync('cards', app.globalData.userCards)
  },
  setDefault: (cardId) => {
    // app.globalData.userCards = app.globalData.userCards.map(item => {
    //   if (item.id == cardId) {
    //     item.isDefault = true
    //   } else {
    //     item.isDefault = false
    //   }
    //   return item
    // })
    // wx.setStorageSync('cards', app.globalData.userCards)
  },
  getDefault: () => {
    // let defaultCard = app.globalData.userCards.find(item => {
    //   return item.isDefault == true
    // })
    // return defaultCard || app.globalData.userCards[0] || {}
  },
  getDefaultHospCard () {
    // let defaultCard = wx.getStorageSync('hospCard').find(item => {
    //   return item.isDefault == true
    // })
    // return defaultCard || app.globalData.hospCards[0] || {}
  },
  select (cardId) {
    // app.globalData.userCards = app.globalData.userCards.map(item => {
    //   if (item.id == cardId) {
    //     item.isSelected = true
    //   } else {
    //     item.isSelected = false
    //   }
    //   wx.setStorageSync('cards', app.globalData.userCards)
    //   return item
    // })
  },
  getSelected () {
    // let isSelected = app.globalData.userCards.find(item => {
    //   return item.isSelected == true
    // })
    // return isSelected || app.globalData.userCards[0]
  },
  saveCards (cards) {
    if(!cards || cards.length === 0) return
    Taro.setStorageSync('cards',cards)
    // app.globalData.userCards = cards
    // let haveDefaultCard = false
    // for (let i in cards) {
    //   if (cards[i].isDefault) {
    //     haveDefaultCard = true
    //     this.setDefaultCard(cards[i].id)
    //     this.selectCard(cards[i].id)
    //     return
    //   }
    // }
    // if (!haveDefaultCard && cards.length > 0) {
    //   this.setDefaultCard(cards[0].id)
    //   cardSetDefault(cards[0].id).then(res => {
    //   })
    // }
    // wx.setStorageSync('cards', app.globalData.userCards)
  },
  // 替换卡信息
  update (cardInfo) {
    // app.globalData.userCards.map(item => {
    //   if (item.id == cardInfo.id) {
    //     item = cardInfo
    //   }
    //   return item
    // })
    // wx.setStorageSync('cards', app.globalData.userCards)
  }
}