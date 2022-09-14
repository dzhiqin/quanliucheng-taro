import * as Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { View,Swiper,SwiperItem,Image } from '@tarojs/components'
import { useState } from 'react'
import * as React from 'react'
import { TaroSubscribeService } from '@/service/api/taro-api'
import { custom } from '@/custom/index'
// import { CardsHealper } from '@/utils/cards-healper'
import { useDidShow } from '@tarojs/taro'
import qrcodeImg from '@/images/icons/qrcode.png'
import './health-cards.less'
import SubscribeNotice from '../subscribe-notice/subscribe-notice'

export default function HealthCards(props: {
  cards?: any,
  switch?: boolean
}) {
  const [isLogin, setLoginStatus] = useState(false)
  const [showNotice,setShowNotice] = useState(false)
  const [cards,setCards] = useState(props.cards || [])
  const [currentCard,setCurrentCard] = useState(0)
  const [selectedCard, setSelected] = useState({
    name: '',
    cardNo: '',
    isDefault: false
  })
  useDidShow(() => {
    const res = Taro.getStorageSync('userInfo')
    if(res){
      setLoginStatus(true)
    }
    const cardsList = Taro.getStorageSync('cards')
    // console.log('cardslist',cardsList);
    setCards(cardsList)
    for(let i =0;i< cardsList.length;i++){
      if(cardsList[i].isDefault){
        setCurrentCard(i)
        setSelected(cardsList[i])
        break
      }
    }
  })
  const handleLogin = async () =>{
    let subsRes = await TaroSubscribeService(custom.longtermSubscribe.pendingPayReminder,custom.longtermSubscribe.visitReminder)
    if(!subsRes.result){
      setShowNotice(true)
    }else{
      Taro.navigateTo({
        url: '/pages/login/login'
      })
    }
  }
  const handleAddCard = () => {
    Taro.navigateTo({url: '/pages/bind-pack/cards-list/cards-list'})
  }
  const onCardChange = (e) => {
    // const index = e.detail.current
    // const cardId = cards[index].id
    // setCurrentCard(index)
    // CardsHealper.setDefault(cardId)
    // Taro.showToast({
    //   title: '您已切换默认卡',
    //   icon: 'none'
    // })
  }
  const onSwitch = () => {
    Taro.navigateTo({
      url: '/pages/bind-pack/cards-list/cards-list?action=switchCard'
    })
  }
  const navToCardDetail = (card) => {
    Taro.setStorageSync('card',card)
    Taro.navigateTo({url: `/pages/bind-pack/card-detail/card-detail`})
  }
  if(!isLogin){
    return (
      <View style='padding:40rpx 40rpx 0'>
        <View className='login-card' onClick={handleLogin}>
            <Image src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/man.png' className='login-card-avatar'></Image>
            <View className='login-card-name'>请先登录</View>
        </View>
        {
          showNotice &&
          <SubscribeNotice show={showNotice} />
        }
      </View>
    )
  }else if(cards.length === 0){
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
      <View style='padding:40rpx 40rpx 0'>
        <View className='add-card single-card'>
            <View className='single-card-content' onClick={navToCardDetail.bind(null,cards[0])}>
              <View>
                <View style='color: white'>您好，{cards[0].name}</View>
                <View className='single-card-txt'>诊疗卡号{cards[0].cardNo}</View>
              </View>
              <Image className='single-card-icon' src={qrcodeImg} ></Image>
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
                  <View style='color: white'>您好，{selectedCard.name}</View>
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
            current={currentCard}
          >
            {
              cards && cards.map((item,index) => 
                <SwiperItem key={index} className='swiper-item-wrap'>
                  <View className='swiper-item' onClick={navToCardDetail.bind(null,item)}>
                    <View className='swiper-item-info'>
                      <View className='swiper-item-name'>您好，{item.name}</View>
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