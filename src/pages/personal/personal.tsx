import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import BkPanel from '@/components/bk-panel/bk-panel'
import { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import orderBluePng from '@/images/icons/order_blue.png'
import orderYellowPng from '@/images/icons/order_yellow.png'
import orderGreenPng from '@/images/icons/order_green.png'
import healthCardPng from '@/images/icons/health_card.png'
import './personal.less'
import LoginRemindModal from '@/components/login-remind-modal/login-remind-modal'

export default function Personal() {
  const [loginRemind,setLoginRemind] = useState(false)
  const [cards,setCards] = useState()
  const userInfo = Taro.getStorageSync('userInfo')
  const onClickPanel = (e) => {
    if(e){
      Taro.navigateTo({url: e})
    }else{
      Taro.showToast({
        title: '开发中……',
        icon: 'loading'
      })
    }
  }
  useDidShow(() => {
    let res = Taro.getStorageSync('cards')
    setCards(res)
    const user = Taro.getStorageSync('userInfo')
    if(!user){
      setLoginRemind(true)
    }
  })
  return (
    <View className='personal'>
      <LoginRemindModal show={loginRemind} />
      <View className='header'>
        <View className='header-title'>个人中心</View>
        <View className='header-info'>
          <Image className='header-info-avatar' src={userInfo.avatarUrl}></Image>
          <View>
            <View className='header-info-name'>{userInfo.nickName}</View>
            {/* <View className='header-info-number'>1234567</View> */}
          </View>
        </View>
        <HealthCards cards={cards}></HealthCards>
      </View>
      <View className='content'>
        <BkPanel arrow onClick={onClickPanel.bind(this,'/pages/register-pack/order-list/order-list')} >
          <View className='panel'>
            <Image src={orderBluePng} className='panel-icon'></Image>
            <View className='panel-name'>挂号订单</View>
          </View>
        </BkPanel>
        <BkPanel arrow onClick={onClickPanel.bind(this,'/pages/payment-pack/order-list/order-list')} style='margin-top: 20rpx'>
          <View className='panel'>
            <Image src={orderYellowPng} className='panel-icon'></Image>
            <View className='panel-name'>缴费订单</View>
          </View>
        </BkPanel>
        <BkPanel arrow onClick={onClickPanel.bind(this,'/pages/reports-pack/reports-type/reports-type')} style='margin-top: 20rpx'>
          <View className='panel'>
            <Image src={orderGreenPng} className='panel-icon'></Image>
            <View className='panel-name'>检查检验单</View>
          </View>
        </BkPanel>
        <BkPanel arrow onClick={onClickPanel.bind(this,'/pages/bind-pack/cards-list/cards-list')} style='margin-top: 20rpx'>
          <View className='panel'>
            <Image src={healthCardPng} className='panel-icon'></Image>
            <View className='panel-name'>电子健康卡</View>
          </View>
        </BkPanel>
      </View>
    </View>
  )
}