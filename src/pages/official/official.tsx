import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { useEffect,useState } from 'react'
import { View, Image, RichText } from '@tarojs/components'
import BkTitle from '@/components/bk-title/bk-title'
import { fetchOfficialContent } from '@/service/api/official-api'
import phonePng from '@/images/icons/phone.png'
import globalPng from '@/images/icons/global.png'
import locationPng from '@/images/icons/location.png'
import custom from '@/custom/index'
import './official.less'

export default function Official() {
  const [hospInfo,setHospInfo] = useState({
    hospitalName: '',
    hospLevel: '',
    phone: '',
    website: '',
    addr: '',
    natures:''
  })
  const [banner,setBanner] = useState('https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png')
  const [desc,setDesc] = useState('')
  const navToClinicList = () => {
    // console.log('clinic');
    Taro.navigateTo({
      url: '/pages/official-pack/clinic-list/clinic-list'
    })
  }
  const navToGuideList = () => {
    // console.log('guide');
    Taro.navigateTo({
      url: '/pages/official-pack/guide-list/guide-list'
    })
  }
  useEffect(() => {
    Taro.showLoading({title: '加载中……'})
    fetchOfficialContent().then(res => {
      if(res.resultCode === 0 && res.data){
        setHospInfo(res.data.hospInfo)
        if(res.data.banners.length > 0){
          setBanner(res.data.banners[0])
        }
        setDesc(res.data.introduce)
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }, [])
  return (
    <View className='official'>
      <View className='official-banner'>
        <Image src={banner} />
      </View>
      <View className='official-header'>
        <Image src={custom.logo} className='official-header-logo' />
        <View className='official-header-wrap'>
          <View className='official-header-title'>{hospInfo.hospitalName}</View>
          <View className='official-header-tabs'>
            {
              hospInfo.hospLevel &&
              <View className='official-header-tab primary-bg'>{hospInfo.hospLevel}</View>
            }
            {
              hospInfo.natures &&
              <View className='official-header-tab info-bg'>{hospInfo.natures}</View>
            }
          </View>    
        </View>
        
      </View>
      <View style='padding: 0 40rpx 40rpx'>
        <View className='official-contact'>
          {
            hospInfo.phone &&
            <View className='official-contact-item'>
              <Image className='official-contact-icon' src={phonePng}></Image>
              <View className='official-contact-text'>{hospInfo.phone}</View>
            </View>
          }
          {
            hospInfo.website && 
            <View className='official-contact-item'>
              <Image className='official-contact-icon' src={globalPng}></Image>
              <View className='official-contact-text'>{hospInfo.website}</View>
            </View>
          }
          {
            hospInfo.addr &&
            <View className='official-contact-item'>
              <Image className='official-contact-icon' src={locationPng}></Image>
              <View className='official-contact-text'>{hospInfo.addr}</View>
            </View>
          }
          
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
        {
          desc &&
          <View>
            <BkTitle title='医院介绍' style='margin: 40rpx 0 20rpx' />
            <View className='official-richtext'>
              <RichText nodes={desc} />
            </View>
          </View>
        }
        
      </View>
      
    </View>
  )
}