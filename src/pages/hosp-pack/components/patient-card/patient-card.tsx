import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View,Image } from '@tarojs/components'
import { AtList,AtListItem } from 'taro-ui'
import { useState } from 'react'
import { useDidShow } from '@tarojs/taro'
import { custom } from '@/custom/index'
import { CardsHealper } from '@/utils/cards-healper'
import { fetchInHospCards, TaroNavigateService } from '@/service/api'
import { modalService } from '@/service/toast-service'
import QrCode from 'qrcode'
import BaseModal from '@/components/base-modal/base-modal'

export default function PatientCard (props:{onCard: Function}) {
  const [card,setCard] = useState(undefined)
  const [show,setShow] = useState(false)
  const [qrcodeSrc,setQrcodeSrc] = useState(undefined)

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
              TaroNavigateService('card-pack','cards-list',null,true)
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
                  TaroNavigateService('hosp-pack','binding-card')
                }
              }})
          }
        })
      }
      
    }
  })
  const triggerEvent = (_card) => {
    setCard(_card)
    QrCode.toDataURL(_card.cardNo).then(url => {
      setQrcodeSrc(url)
    })
    if(typeof props.onCard === 'function'){
      props.onCard(_card)
    }
  }
  const navToCardList = () => {
    setShow(false)
    if(custom.hospName === 'jszyy'){
      TaroNavigateService('card-pack','cards-list')
    }else{
      TaroNavigateService('hosp-pack','card-list')
    }
  }
  
  return(
    <View>
      <AtList>
        <AtListItem
          arrow='right'
          note={"住院号：" + card?.cardNo}
          title={card?.name}
          iconInfo={{ size: 25, color: '#FF4949', value: 'credit-card', }}
          onClick={() => setShow(true)}
        />
      </AtList>
      <BaseModal show={show} cancel={navToCardList} confirm={() => setShow(false)} cancelText='切换卡' title='住院号'>
        <View className=''>
          {
            qrcodeSrc &&
            <Image style='width: 250px; height: 250px;' src={qrcodeSrc}></Image>
          }
          <View>姓名：{card?.name}</View>
          <View>住院号：{card?.cardNo}</View>
        </View>
      </BaseModal>
    </View>
  )
}