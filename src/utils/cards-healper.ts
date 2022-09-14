import * as Taro from '@tarojs/taro'
import { setDefaultCard, deleteCard, fetchHealthCards } from '@/service/api'

import {Card} from '../interfaces/card'

const updateAllCards = () => {
  return new Promise((resolve,reject) => {
    fetchHealthCards().then(res => {
      if(res.resultCode === 0){
        const cards = res.data
        Taro.setStorageSync('cards',cards)
        resolve('ok')
      }else{
        reject(res.message)
      }
    })
  })
}
const saveCards = (value: any) => {
  return new Promise((resolve,reject)=>{
    Taro.setStorageSync('cards',value)
      resolve({success: true})
  })
}
const remove = (_card)=> {
  let cards = Taro.getStorageSync('cards')
  const card = cards.find(item => item.id === _card.id)
  return new Promise((resolve,reject) => {
    if(!card) {
      reject('没有找到对应的卡')
    }

    deleteCard({id:_card.id}).then(async(res) => {
      if(res.resultCode === 0){
        let index =0
        for(let i=0;i<cards.length;i++){
          if(cards[i].id === _card.id){
            index = i
            break
          }
        }
        cards.splice(index,1)
        Taro.setStorageSync('cards',cards)
        if(_card.isDefault && cards[0] && cards[0].id){
          await setDefault(cards[0].id)
        }
        resolve(res.message)

      }else{
        reject(res.message)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
const setDefault = async (cardId:string) => {
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
  
}
const getDefault = () => {
  let cards = Taro.getStorageSync('cards')
  let card:Card = null
  if(cards && cards.length > 0){
    card = cards.find(i => i.isDefault)
    if(!card){
      card = cards[0]
      setDefaultCard({id: card.id}) // 如果没有默认卡，自动设置第一张卡片为默认
      .then(() => {
        updateAllCards()
      })
    }
  }else{
    showBindCardModal()
  }
  return card
 
}
const showBindCardModal = () => {
  Taro.showModal({
    content: '请先绑卡',
    showCancel: false,
    success: res => {
      if(res.confirm){
        // Taro.navigateTo({url: '/pages/bind-pack/bind-card/bind-card'})
        Taro.navigateTo({url: '/pages/bind-pack/cards-list/cards-list'})
      }else{
        showBindCardModal()
      }
    }
  })
}
export const CardsHealper = {
  updateAllCards,
  saveCards,
  remove,
  setDefault,
  getDefault
}