/* eslint-disable react/jsx-no-duplicate-props */
import { MyContext } from '@/utils/my-context'
import * as Taro from '@tarojs/taro'
import { View,Swiper,SwiperItem,Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import * as React from 'react'
import { getSetting, wxSubscribeMessage } from '@/service/api/taro-api'
import templateId from '@/utils/templateId'
import subscribeNoticeImg from '@/images/subscribe_notice.png'

import qrcodeImg from '../../images/icons/qrcode.png'
import './health-cards.less'

export default function HealthCards(props: any) {
  const [userInfo, setUserInfo] = useState({cards:[]})
  const [showNotice,setShowNotice] = useState(false)
  useEffect(() => {
    // const userInfo = Taro.getStorageSync('userInfo')
    // console.log('userInfo:',userInfo)
    // setUserInfo(userInfo)
    console.log('healthcard on load')
    return () => {
      // cleanup
      console.log('health card unload')
    }
  })
  const handleLogin =() =>{
    getSetting()
    const tempIds = templateId.longterm.treatmentAndPayment()
    wxSubscribeMessage(
      tempIds, 
      () => {
        console.log('success')
        Taro.navigateTo({
          url: '/pages/login/login'
        })
      },
      (res) => {
        console.log('fail',res)
        // setShowNotice(true)
      })
  }
  if(userInfo.cards.length === 0 ){
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
  }else{
    return (
      <View className='health-cards'>
        <Swiper
          className={userInfo.cards.length < 2 ? 'swiper-single' : 'swiper-complex'}
          indicatorColor='#999'
          indicatorActiveColor='#56A1F4'
          circular
          indicatorDots={userInfo.cards.length < 2 ? false : true}
        >
          {
            userInfo.cards && userInfo.cards.map((item,index) => 
              <SwiperItem key={index} className={userInfo.cards.length < 2 ? '' : 'swiper-item-wrap'}>
                <View className='swiper-item'>
                  <View className='swiper-item-info'>
                    <View>您好，丹青</View>
                    <View>诊疗卡号：12345678</View>
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