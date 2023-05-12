import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import BkPanel from '@/components/bk-panel/bk-panel'
import orderBluePng from '@/images/icons/order_blue.png'
import orderYellowPng from '@/images/icons/order_yellow.png'
import orderGreenPng from '@/images/icons/order_green.png'
import healthCardPng from '@/images/icons/health_card.png'
import { TaroNavigateService, TaroNavToYiBao } from '@/service/api'
import {custom} from '@/custom/index'
import { loadingService } from '@/service/toast-service'
import './personal.less'

export default function Personal() {
  const onClickPanel = (e) => {
    if(e){
      TaroNavigateService(e)
    }else{
      Taro.showToast({
        title: '开发中……',
        icon: 'loading'
      })
    }
  }
  
  const navToYiBao = () => {
    loadingService(true,'即将跳转')
    TaroNavToYiBao(() => {
      loadingService(false)
    })
  }
  return (
    <View className='personal'>
      {/* <View className='header'>
        <View className='header-title'>个人中心</View>
        <View className='header-info'>
          <Image className='header-info-avatar' src={userInfo.avatarUrl}></Image>
          <View>
            <View className='header-info-name'>{userInfo.nickName}</View>
          </View>
        </View>
        <HealthCards />
      </View> */}
      <HealthCards />
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
        {/* {// 临时方案
          custom.hospName !== 'lwzxyy' &&
          <BkPanel arrow onClick={onClickPanel.bind(this,'/pages/reports-pack/reports-type/reports-type')} style='margin-top: 20rpx'>
            <View className='panel'>
              <Image src={orderGreenPng} className='panel-icon'></Image>
              <View className='panel-name'>检查检验单</View>
            </View>
          </BkPanel>
        } */}
        <BkPanel arrow onClick={onClickPanel.bind(this,'/pages/reports-pack/reports-type/reports-type')} style='margin-top: 20rpx'>
          <View className='panel'>
            <Image src={orderGreenPng} className='panel-icon'></Image>
            <View className='panel-name'>检查检验单</View>
          </View>
        </BkPanel>
        <BkPanel arrow onClick={onClickPanel.bind(this,process.env.TARO_ENV==='weapp' ? '/pages/card-pack/cards-list/cards-list': '/pages/card-pack/cards-list-alipay/cards-list-alipay')} style='margin-top: 20rpx'>
          <View className='panel'>
            <Image src={healthCardPng} className='panel-icon'></Image>
            {/* 特殊处理 jszyy只有诊疗卡 */}
            <View className='panel-name'>{custom.hospName === 'jszyy'? '电子诊疗卡' : '电子健康卡'}</View>
          </View>
        </BkPanel>
        {
          custom.feat.inHospCard &&
          <BkPanel arrow onClick={onClickPanel.bind(this,'/pages/hosp-pack/card-list/card-list')} style='margin-top: 20rpx'>
            <View className='panel'>
              <Image src={healthCardPng} className='panel-icon'></Image>
              <View className='panel-name'>住院卡</View>
            </View>
          </BkPanel>
        }
        {
          custom.feat.YiBaoCard && 
          <BkPanel arrow onClick={navToYiBao} style='margin-top: 20rpx'>
            <View className='panel'>
              <Image src={healthCardPng} className='panel-icon'></Image>
              <View className='panel-name'>医保卡</View>
            </View>
          </BkPanel>
        }
      </View>
    </View>
  )
}