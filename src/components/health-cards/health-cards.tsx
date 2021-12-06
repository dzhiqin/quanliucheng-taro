import * as Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { View,Swiper,SwiperItem,Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import * as React from 'react'
import { getSetting, taroSubscribeMessage } from '@/service/api/taro-api'
import subscribeNoticeImg from '@/images/subscribe_notice.png'
import { longtermSubscribe } from '@/utils/index'
import "taro-ui/dist/style/components/icon.scss"
import cardsHealper from '@/utils/cards-healper'
import { useDidShow } from '@tarojs/taro'
import qrcodeImg from '../../images/icons/qrcode.png'
import './health-cards.less'

export default function HealthCards(props: any) {
  const [isLogin, setLoginStatus] = useState(false)
  const [showNotice,setShowNotice] = useState(false)
  const [cards,setCards] = useState(props.cards || [])
  const [currentCard,setCurrentCard] = useState(0)
 
  // useEffect(() => {
  //   console.log('cards change',props.cards)
  //   if(props.cards && props.cards.length > 0){
  //     setCards(props.cards)
  //     for(let i =0; i< props.cards.length;i++){
  //       if(props.cards[i].isDefault){
  //         setCurrentCard(i)
  //         break
  //       }
  //     }
  //   }
  // },[props.cards])
  useDidShow(() => {
    const res = Taro.getStorageSync('userInfo')
    if(res){
      setLoginStatus(true)
    }
    const cardsList = Taro.getStorageSync('cards')
    setCards(cardsList)
    for(let i =0;i< cardsList.length;i++){
      if(cardsList[i].isDefault){
        setCurrentCard(i)
        break
      }
    }
  })
  const handleLogin =() =>{
    // getSetting()
    const tempIds = longtermSubscribe.treatmentAndPayment()
    taroSubscribeMessage(
      tempIds, 
      () => {
        Taro.navigateTo({
          url: '/pages/login/login'
        })
      },
      (err) => {
        // console.log('fail',err)
        setShowNotice(true)
      })
  }
  const handleAddCard = () => {
    Taro.navigateTo({url: '/pages/bind-card/bind-card'})
  }
  const onCardChange = (e) => {
    const index = e.detail.current
    const cardId = cards[index].id
    setCurrentCard(index)
    cardsHealper.setDefault(cardId)
    Taro.showToast({
      title: '您已切换默认卡',
      icon: 'none'
    })
  }
  if(!isLogin){
    return (
      <View style='padding:40rpx 40rpx 0'>
        <View className='login-card' onClick={handleLogin}>
            <Image src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/man.png' className='login-card-avatar'></Image>
            <View className='login-card-txt'>请先登录</View>
        </View>
        {showNotice ? <View className='subscribe-notice'>
          <Image src={subscribeNoticeImg}></Image>
        </View> : ''}
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
  }else{
    return (
      <View className='health-cards'>
        <Swiper
          className={cards.length < 2 ? 'swiper-single' : 'swiper-complex'}
          indicatorColor='#999'
          indicatorActiveColor='#56A1F4'
          circular
          indicatorDots={cards.length < 2 ? false : true}
          onChange={onCardChange.bind(this)}
          current={currentCard}
        >
          {
            cards && cards.map((item,index) => 
              <SwiperItem key={index} className={cards.length < 2 ? '' : 'swiper-item-wrap'}>
                <View className='swiper-item'>
                  <View className='swiper-item-info'>
                    <View>您好，{item.name}</View>
                    <View>诊疗卡号：{item.cardNo}</View>
                  </View>
                  <Image className='swiper-item-icon' src={qrcodeImg}></Image>
                </View>
              </SwiperItem>  
            )
          }
        </Swiper>
      </View>
    )
  }
  
}