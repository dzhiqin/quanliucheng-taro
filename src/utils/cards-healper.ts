// const app = getApp()
// const { unique } = require('./util')
// import {cardSetDefault} from './WX_api'
import * as Taro from '@tarojs/taro'
import { setDefaultCard, deleteCard } from '@/service/api'

import {Card} from '../interfaces/card'


export default {
  add: (card: Card)=> {
    console.log('add');
    let cards = Taro.getStorageSync('cards')
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
    Taro.setStorageSync('cards',cards)
  },
  delete: (cardId:number)=> {
    let cards = Taro.getStorageSync('cards')
    const card = cards.find(item => item.id === cardId)
    return new Promise((resolve,reject) => {
      if(!card) {
        reject('没有找到对应的卡')
      }

      deleteCard({id:cardId}).then(res => {
        if(res.resultCode === 0){
          resolve(res.message)
          let index =0
          for(let i=0;i<cards.length;i++){
            if(cards[i].id === cardId){
              index = i
              break
            }
          }
          cards.splice(index,1)
          Taro.setStorageSync('cards',cards)
        }
      }).catch(err => {
        reject(err)
      })
    })
    
    // app.globalData.userCards = app.globalData.userCards.filter(item => {
    //   return item.id != cardId
    // })
    // wx.setStorageSync('cards', app.globalData.userCards)
  },
  setDefault: (cardId:string) => {
    let cards = Taro.getStorageSync('cards')
    console.log('default-cards',cards);
    
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
    let cards = Taro.getStorageSync('cards')
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