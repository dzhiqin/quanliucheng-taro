import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { View, Image, RichText } from '@tarojs/components'
import BkTitle from '@/components/bk-title/bk-title'
import { getOfficialContent } from '@/service/api/official-api'
import crossPng from '@/images/icons/cross.png'
import phonePng from '@/images/icons/phone.png'
import globalPng from '@/images/icons/global.png'
import locationPng from '@/images/icons/location.png'

import './official.less'

export default function Official() {
  const navToClinicList = () => {
    console.log('clinic');
    Taro.navigateTo({
      url: '/pages/official-pack/clinic-list/clinic-list'
    })
  }
  const navToGuideList = () => {
    console.log('guide');
    Taro.navigateTo({
      url: '/pages/official-pack/guide-list/guide-list'
    })
  }
  useEffect(() => {
    getOfficialContent().then(res => {
      console.log('getofficialcontent',res);
      
    })
  }, [])
  return (
    <View className='official'>
      <View className='official-banner'>
        <Image src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png' />
      </View>
      <View className='official-header'>
        <Image src={crossPng} />
        <View className='official-header-wrap'>
          <View className='official-header-title'>广州医科大学附属第五医院</View>
          <View className='official-header-tabs'>
            <View className='official-header-tab primary-bg'>三甲医院</View>
            <View className='official-header-tab info-bg'>公立医院</View>
          </View>    
        </View>
        
      </View>
      <View style='padding: 0 40rpx 40rpx'>
        <View className='official-contact'>
          <View className='official-contact-item'>
            <Image className='official-contact-icon' src={phonePng}></Image>
            <View className='official-contact-text'>020-12345678</View>
          </View>
          <View className='official-contact-item'>
            <Image className='official-contact-icon' src={globalPng}></Image>
            <View className='official-contact-text'>020-12345678</View>
          </View>
          <View className='official-contact-item'>
            <Image className='official-contact-icon' src={locationPng}></Image>
            <View className='official-contact-text'>广东海珠区新港路</View>
          </View>
        </View>
        <BkTitle title='医疗服务' style='margin: 40rpx 0 20rpx' />
        <View className='official-service'>
          <View className='official-service-item' onClick={navToClinicList.bind(this)}>
            <Image className='official-service-item-icon' src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/website_icon7.png'></Image>
            <View className='official-service-item-name'>科室介绍</View>
          </View>
          <View className='official-service-item' onClick={navToGuideList.bind(this)}>
            <Image className='official-service-item-icon' src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/website_icon8.png'></Image>
            <View className='official-service-item-name'>就诊指南</View>
          </View>
        </View>
        <BkTitle title='医院介绍' style='margin: 40rpx 0 20rpx' />
        <View className='official-richtext'>

        </View>
      </View>
      
    </View>
  )
}