import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { AtIcon } from 'taro-ui'
import { View,Image } from '@tarojs/components'
import { useState } from 'react'
import { CARD_ACTIONS } from '@/enums/index'
import { useDidHide,useDidShow} from '@tarojs/taro'
import { getPrivacyName } from '@/utils/tools'
import '../health-cards/health-cards.less'
import { TaroNavigateService } from '@/service/api'
import BaseModal from '../base-modal/base-modal'
import QrCode from 'qrcode'
import { custom } from '@/custom/index'

export default function HospCards(props: {onCard:Function}){
  const {onCard} = props
  const [show,setShow] = useState(false)
  const [qrcodeSrc,setQrcodeSrc] = useState(undefined)
  const [hospCard,setHospCard] = useState(Taro.getStorageSync('hospCard') as {
    isDefault: false,
    name: '',
    cardNo: ''
  })
  useDidHide(() => {
    Taro.eventCenter.off(CARD_ACTIONS.UPDATE_ALL)
  })
  useDidShow(() => {
    const token = Taro.getStorageSync('token')
    if(token) {
      const card = Taro.getStorageSync('hospCard')
      handleSetCard(card)
    }else{
      Taro.eventCenter.on(CARD_ACTIONS.UPDATE_ALL, () => {
        const _card = Taro.getStorageSync('hospCard')
        handleSetCard(_card)
      })
    }
    
  })
  const handleSetCard = (card) => {
    setHospCard(card)
    if(!card) return
    onCard(card)
    QrCode.toDataURL(card.cardNo).then(url => {
      setQrcodeSrc(url)
    })
  }
  const navToCardDetail = () => {
    setShow(true)
  }
  const navToCardList = () => {
    setShow(false)
    if(custom.hospName === 'jszyy'){
      TaroNavigateService('card-pack','cards-list')
    }else{
      TaroNavigateService('hosp-pack','card-list')
    }
  }
  const onSwitch = (e) => {
    e.stopPropagation()
    TaroNavigateService('hosp-pack','card-list')
  }
  return (
    <View style='padding: 40rpx 40rpx 0'>
      <View className='add-card single-card'>
        <View className='single-card-content' onClick={navToCardDetail.bind(null,hospCard)}>
          {
            hospCard && 
            <View>
              <View style='color: white'>您好，{process.env.TARO_ENV === 'alipay'? getPrivacyName(hospCard.name) : hospCard.name}</View>
              <View className='single-card-txt'>住院卡号{hospCard?.cardNo}</View>
            </View>
          }
          {
            !hospCard &&
            <View>
              <View style='color: white'>请先绑定住院卡</View>
            </View>
          }
          {
            hospCard?.isDefault &&
            <view className='card-tag'>默认</view>
          }
          <View className='single-card-switch' onClick={onSwitch}>
            {hospCard ? "切换住院卡" : "绑定住院卡"}
            <AtIcon value='chevron-right' size='20' color='#0A3A6E'></AtIcon>
          </View>
        </View>
      </View>
      <BaseModal show={show} cancel={() => setShow(false)} confirm={navToCardList} confirmText='切换卡' title='住院号'>
        <View className=''>
          {
            qrcodeSrc &&
            <Image style='width: 250px; height: 250px;' src={qrcodeSrc}></Image>
          }
          <View>姓名：{hospCard?.name}</View>
          <View>住院号：{hospCard?.cardNo}</View>
        </View>
      </BaseModal>
    </View>   
  )
}