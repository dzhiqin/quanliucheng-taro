import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { AtList,AtListItem } from 'taro-ui'
import { useState } from 'react'
import { useDidShow } from '@tarojs/taro'
import { custom } from '@/custom/index'
import { CardsHealper } from '@/utils/cards-healper'
import { fetchInHospCards } from '@/service/api'
import { modalService } from '@/service/toast-service'

export default function PatientCard (props:{onCard: Function}) {
  const [card,setCard] = useState(undefined)
  useDidShow(() => {
    let _card
    if(custom.hospName === 'jszyy'){
      _card = CardsHealper.getDefault()
      if(!_card) {
        modalService({
          content: '您还未绑卡',
          showCancel: true,
          confirmText: '去绑卡',
          success: re => {
            if(re.confirm){
              Taro.navigateTo({url: process.env.TARO_ENV === 'weapp' ?'/pages/card-pack/cards-list/cards-list':'/pages/card-pack/cards-list-alipay/cards-list-alipay'})
            }
          }
        })
      }else{
        triggerEvent(_card)
      }
    }else{
      const patientCards = Taro.getStorageSync('patientCards')
      if(patientCards){
        _card = patientCards.find(i => i.isDefault) 
        triggerEvent(_card)
      }else{
        fetchInHospCards().then(res => {
          if(res.resultCode === 0){
            if(res.data && res.data.length > 0){
              Taro.setStorageSync('patientCards',res.data)
              _card = res.data.find(i => i.isDefault)
              triggerEvent(_card)
            }
          }else{
            modalService({
              content: '您还没绑定住院卡',
              showCancel: true,
              confirmText: '去绑卡', 
              success: re => {
                if(re.confirm){
                  Taro.navigateTo({url: '/pages/hosp-pack/binding-card/binding-card'})
                }
              }})
          }
        })
      }
      
    }
  })
  const triggerEvent = (_card) => {
    setCard(_card)
    if(typeof props.onCard === 'function'){
      props.onCard(_card)
    }
  }
  const navToCardList = () => {
    if(custom.hospName === 'jszyy'){
      Taro.navigateTo({url: '/pages/card-pack/cards-list/cards-list'})
    }else{
      Taro.navigateTo({url: '/pages/hosp-pack/card-list/card-list'})
    }
  }
  return(
    <View>
      <AtList>
        <AtListItem
          arrow='right'
          note={card?.cardNo}
          title={card?.name}
          iconInfo={{ size: 25, color: '#FF4949', value: 'credit-card', }}
          onClick={navToCardList}
        />
      </AtList>
    </View>
  )
}