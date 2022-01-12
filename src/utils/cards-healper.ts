import * as Taro from '@tarojs/taro'
import { setDefaultCard, deleteCard, fetchHealthCards } from '@/service/api'

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
  },
  setDefault: async (cardId:string) => {
    let cards = Taro.getStorageSync('cards')
    const newCards = cards.map(item => {
      return{
        ...item,
        isDefault: item.id === cardId
      }
    })
    return new Promise((resolve,reject) => {
      setDefaultCard({id: cardId}).then(res => {
        Taro.setStorageSync('cards',newCards)
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
    
  },
  getDefault: () => {
    let cards = Taro.getStorageSync('cards')
    let card:Card = null
    if(cards){
      card = cards.find(i => i.isDefault) || cards[0]
    }
    return card
   
  },
  updateAllCards: () => {
    fetchHealthCards().then(res => {
      if(res.resultCode === 0){
        const cards = res.data
        Taro.setStorageSync('cards',cards)
      }
    })
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
    // Taro.setStorageSync('cards', app.globalData.userCards)
  }
}