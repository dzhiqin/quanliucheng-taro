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

export default function Personal() {
  const [cards,setCards] = useState()

  const onClickPanel = () => {
    console.log('click panel');
    Taro.showToast({
      title: '开发中……',
      icon: 'loading'
    })
  }
  useDidShow(() => {
    const res = Taro.getStorageSync('cards') || []
    setCards(res)
  })
  return (
    <View className='personal'>
      <View className='header'>
        <View className='header-title'>个人中心</View>
        <View className='header-info'>
          <Image className='header-info-avatar' src='http://storage.360buyimg.com/mtd/home/32443566_635798770100444_2113947400891531264_n1533825816008.jpg'></Image>
          <View>
            <View className='header-info-name'>紫竹</View>
            <View className='header-info-number'>1234567</View>
          </View>
        </View>
        <HealthCards cards={cards}></HealthCards>
      </View>
      <View className='content'>
        <BkPanel arrow onClick={onClickPanel.bind(this)} >
          <View className='panel'>
            <Image src={orderBluePng} className='panel-icon'></Image>
            <View className='panel-name'>挂号订单</View>
          </View>
        </BkPanel>
        <BkPanel arrow onClick={onClickPanel.bind(this)} style='margin-top: 20rpx'>
          <View className='panel'>
            <Image src={orderYellowPng} className='panel-icon'></Image>
            <View className='panel-name'>缴费订单</View>
          </View>
        </BkPanel>
        <BkPanel arrow onClick={onClickPanel.bind(this)} style='margin-top: 20rpx'>
          <View className='panel'>
            <Image src={orderGreenPng} className='panel-icon'></Image>
            <View className='panel-name'>检查检验单</View>
          </View>
        </BkPanel>
        <BkPanel arrow onClick={onClickPanel.bind(this)} style='margin-top: 20rpx'>
          <View className='panel'>
            <Image src={healthCardPng} className='panel-icon'></Image>
            <View className='panel-name'>电子健康卡</View>
          </View>
        </BkPanel>
      </View>
    </View>
  )
}