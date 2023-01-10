import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { useEffect,useState } from 'react'
import { View, Image,Swiper,SwiperItem } from '@tarojs/components'
import BkTitle from '@/components/bk-title/bk-title'
import { fetchOfficialContent } from '@/service/api/official-api'
import phonePng from '@/images/icons/phone.png'
import globalPng from '@/images/icons/global.png'
import locationPng from '@/images/icons/location.png'
import {custom} from '@/custom/index'
import './official.less'
import { loadingService, modalService } from '@/service/toast-service'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'

export default function Official() {
  const [hospInfo,setHospInfo] = useState({
    hospitalName: '',
    hospLevel: '',
    phone: '',
    website: '',
    addr: '',
    natures:'',
    logo: ''
  })
  const [banners,setBanners] = useState(['https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png'])
  const [desc,setDesc] = useState(undefined)
  const navToClinicList = () => {
    Taro.navigateTo({
      url: '/pages/official-pack/clinic-list/clinic-list'
    })
  }
  const navToGuideList = () => {
    Taro.navigateTo({
      url: '/pages/official-pack/guide-list/guide-list'
    })
  }
  Taro.useReady(() => {
    if(custom.feat.guangHuaMonitor.enable){
      reportCmPV_YL({title: '医院介绍'})
    }
  })
  useEffect(() => {
    Taro.showLoading({title: '加载中……'})
    fetchOfficialContent().then(res => {
      loadingService(false)
      if(res.resultCode === 0 && res.data){
        setHospInfo(res.data.hospInfo)
        if(res.data.banners.length > 0){
          const list = res.data.banners.map(i => i.imgPath)
          setBanners(list)
        }
        setDesc(res.data.introduce)
      }
    }).catch(err => {
      loadingService(false)
      modalService({content: JSON.stringify(err)})
    })
  }, [])
  const handleOpenLocation = () => {
    Taro.openLocation({
      latitude: custom.latitude,
      longitude: custom.longitude,
      name: hospInfo.addr
    })
  }
  const handleOpenPhone = () => {
    Taro.makePhoneCall({phoneNumber: hospInfo.phone})
  }
  return (
    <View className='official'>
      <View className='official-banner'>
        <Swiper
          className='test-h'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          circular
          indicatorDots
          autoplay
        >  
            {
              banners.map((item,index) => 
                <SwiperItem key={index}>
                  <Image src={item} style='width: 100%' />
                </SwiperItem>
              )
            }
        </Swiper>
      </View>
      <View className='official-header'>
        <Image src={hospInfo.logo || custom.logo} className='official-header-logo' />
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
            <View className='official-contact-item' onClick={handleOpenPhone}>
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
            <View className='official-contact-item' onClick={handleOpenLocation}>
              <Image className='official-contact-icon' src={locationPng}></Image>
              <View className='official-contact-text'>{hospInfo.addr}</View>
            </View>
          }
          
        </View>
        <BkTitle title='医疗服务' style='margin: 40rpx 0 20rpx' />
        <View className='official-service'>
          {
            (process.env.TARO_ENV !== 'alipay' || custom.hospName !== 'jszyy') &&
            <View className='official-service-item' onClick={navToClinicList.bind(this)}>
              <Image className='official-service-item-icon' src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/website_icon7.png'></Image>
              <View className='official-service-item-name'>科室介绍</View>
            </View>
          }
          
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
              <View dangerouslySetInnerHTML={{__html: desc}}></View>
            </View>
          </View>
        }
        
      </View>
      
    </View>
  )
}