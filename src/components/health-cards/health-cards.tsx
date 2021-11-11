/* eslint-disable react/jsx-no-duplicate-props */
import { MyContext } from '@/utils/my-context'
import * as Taro from '@tarojs/taro'
import { View,Swiper,SwiperItem,Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import * as React from 'react'
import qrcodeImg from '../../images/icons/qrcode.png'
import './health-cards.less'

export default function HealthCards(props: any) {
  const [userInfo, setUserInfo] = useState({cards:[1,2]})
  
  useEffect(() => {
    // const userInfo = Taro.getStorageSync('userInfo')
    // console.log('userInfo:',userInfo)
    // setUserInfo(userInfo)
    return () => {
      // cleanup
    }
  })
  if(userInfo.cards.length === 0 ){
    return (
      <View style='padding:20rpx'>
        <View className='login-card'>
            <Image src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/man.png' className='login-card-avatar'></Image>
            <View className='login-card-txt'>请先登录</View>
        </View>
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