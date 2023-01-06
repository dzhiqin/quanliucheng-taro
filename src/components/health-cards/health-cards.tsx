import * as Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { View,Swiper,SwiperItem,Image } from '@tarojs/components'
import { useState } from 'react'
import * as React from 'react'
import { CardsHealper } from '@/utils/cards-healper'
import { useDidShow } from '@tarojs/taro'
import qrcodeImg from '@/images/icons/qrcode.png'
import './health-cards.less'
import { CARD_ACTIONS } from '@/enums/index'
import { getPrivacyName } from '@/utils/tools'

export default function HealthCards(props: {
  cards?: any,
  switch?: boolean,
  onCard?: any
}) {
  const onCard = props.onCard
  const [cards,setCards] = useState(props.cards || [])
  const [currentIndex,setCurrentIndex] = useState(0)
  const [selectedCard, setSelected] = useState({
    name: '',
    cardNo: '',
    isDefault: false
  })
  Taro.useDidHide(() => {
    Taro.eventCenter.off(CARD_ACTIONS.UPDATE_ALL)
  })
  useDidShow(() => {
    const cardsTemp = Taro.getStorageSync('cards')
    setCards(cardsTemp)
    for(let i =0;i< cardsTemp.length;i++){
      if(cardsTemp[i].isDefault){
        setCurrentIndex(i)
        if(typeof onCard === 'function'){
          onCard(cardsTemp[i])
        }
        setSelected(cardsTemp[i])
        break
      }
    }
    Taro.eventCenter.on(CARD_ACTIONS.UPDATE_ALL,() => {
      const cardsList = Taro.getStorageSync('cards')
      setCards(cardsList)
      for(let i =0;i< cardsList.length;i++){
        if(cardsList[i].isDefault){
          setCurrentIndex(i)
          setSelected(cardsList[i])
          break
        }
      }
    })
    
  })
 
  const handleAddCard = () => {
    if(process.env.TARO_ENV === 'weapp'){
      Taro.navigateTo({url: '/pages/login/login'})
    }
    if(process.env.TARO_ENV === 'alipay'){
      Taro.navigateTo({url: '/pages/card-pack/cards-list-alipay/cards-list-alipay'})
    }
  }
  const onCardChange = (e) => {
    const index = e.detail.current
    const cardId = cards[index].id
    setCurrentIndex(index)
    CardsHealper.setDefault(cardId).then(() => {
      const cardsTemp = cards.map(item => ({...item, isDefault: item.id === cardId}))
      setCards(cardsTemp)
    })
  }
  const onSwitch = (e) => {
    e.stopPropagation()
    if(process.env.TARO_ENV === 'weapp'){
      Taro.navigateTo({
        url: '/pages/card-pack/cards-list/cards-list?action=switchCard'
      })
    }
    if(process.env.TARO_ENV === 'alipay'){
      Taro.navigateTo({
        url: '/pages/card-pack/cards-list-alipay/cards-list-alipay?action=switchCard'
      })
    }
    
  }
  const navToCardDetail = (card) => {
    Taro.setStorageSync('card',card)
    Taro.navigateTo({url: `/pages/card-pack/card-detail/card-detail`})
  }
  
  if(cards.length === 0){
    return (
      <View style='padding:40rpx 40rpx 0'>
        <View className='add-card' onClick={handleAddCard}>
            <View style='margin-left: 40rpx'>
              <AtIcon value='add-circle' size='30' color='#FFF'></AtIcon>
            </View>
            <View className='login-card-txt'>添加就诊人</View>
        </View>
      </View>
    )
  }else if(cards.length === 1){
    return (
      <View style='padding:20rpx 40rpx 0'>
        <View className='add-card single-card'>
            <View className='single-card-content' onClick={navToCardDetail.bind(null,cards[0])} >
              <View>
                <View style='color: white'>您好，{process.env.TARO_ENV === 'alipay' ? getPrivacyName(cards[0].name) : cards[0].name}</View>
                <View className='single-card-txt'>诊疗卡号{cards[0].cardNo}</View>
              </View>
              {/* <Image className='single-card-icon' src={qrcodeImg} ></Image> */}
              <View className='single-card-switch' onClick={onSwitch}>
                切换就诊人
                <AtIcon value='chevron-right' size='20' color='#0A3A6E'></AtIcon>
              </View>
            </View>
        </View>
      </View>
    )
  }else{
    if(props.switch){
      return (
        <View style='padding:40rpx 40rpx 0'>
          <View className='add-card single-card'>
              <View className='single-card-content'>
                <View>
                  <View style='color: white'>您好，{process.env.TARO_ENV === 'alipay'? getPrivacyName(selectedCard.name) : selectedCard.name}</View>
                  <View className='single-card-txt'>诊疗卡号{selectedCard.cardNo}</View>
                </View>
                {
                  selectedCard.isDefault &&
                  <view className='card-tab'>默认</view>
                }
                <View className='single-card-switch' onClick={onSwitch}>
                  切换就诊人
                  <AtIcon value='chevron-right' size='20' color='#0A3A6E'></AtIcon>
                </View>
              </View>
          </View>
        </View>
      )
    }else{
      return (
        <View className='health-cards'>
          <Swiper
            className='swiper'
            indicatorColor='#999'
            indicatorActiveColor='#56A1F4'
            circular
            indicatorDots
            onChange={onCardChange.bind(this)}
            current={currentIndex}
          >
            {
              cards && cards.map((item,index) => 
                <SwiperItem key={index} className={process.env.TARO_ENV === 'weapp' ? 'swiper-item-wrap' : 'swiper-item-wrap-ali'}>
                  <View className='swiper-item' onClick={navToCardDetail.bind(null,item)} style={process.env.TARO_ENV === 'weapp' ? '' : 'padding-top: 60rpx;'}>
                    <View className='swiper-item-info'>
                      <View className='swiper-item-name'>您好，{process.env.TARO_ENV === 'alipay' ? getPrivacyName(item.name) : item.name}</View>
                      <View className='swiper-item-card'>诊疗卡号{item.cardNo}</View>
                    </View>
                    {
                      item.isDefault &&
                      <view className='card-tab'>默认</view>
                    }
                    <Image className='swiper-item-icon' src={qrcodeImg} ></Image>
                  </View>
                </SwiperItem>  
              )
            }
          </Swiper>
        </View>
      )
    }
    
  }
  
}