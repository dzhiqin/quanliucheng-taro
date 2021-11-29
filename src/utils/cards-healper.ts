// const app = getApp()
// const { unique } = require('./util')
// import {cardSetDefault} from './WX_api'
import * as Taro from '@tarojs/taro'
import { setDefaultCard } from '@/service/api'

import {Card} from '../interfaces/card'

let cards = Taro.getStorageSync('cards')

export default {
  add: (card: Card)=> {
    const item = cards.find((i) => i.id === card.id)
    if(item){
      cards = cards.map(obj => {
        if(obj.id === card.id){
          return Object.assign({},obj,item)
        }else{
          return obj
        }
      })
    }else{
      cards.push(card)
    }
    Taro.setStorageSync('cards',JSON.stringify(cards))
  },
  delete: (cardId:string)=> {

    // app.globalData.userCards = app.globalData.userCards.filter(item => {
    //   return item.id != cardId
    // })
    // wx.setStorageSync('cards', app.globalData.userCards)
  },
  setDefault: (cardId:string) => {
    const newCards = cards.map(item => {
      return{
        ...item,
        isDefault: item.id === cardId
      }
    })

    setDefaultCard({id: cardId}).then(res => {
      Taro.setStorageSync('cards',newCards)
    })
  },
  getDefault: () => {
    const card = cards.find(item => item.isDefault)
    return card
   
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
  saveCards (value: any) {
    if(!value || value.length === 0) return
    Taro.setStorageSync('cards',value)
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