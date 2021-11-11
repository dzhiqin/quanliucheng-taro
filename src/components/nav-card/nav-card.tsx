import * as React from 'react'
import { View, Image } from '@tarojs/components'

import './nav-card.less'

export default function NavCard(props: any) {
  return (
    <View className='nav-card'>
     <View className='nav-card-left'>
        <Image className='nav-card-icon' src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/new_home_icon13.png'></Image>
        <View className='nav-card-info'>
          <View className='nav-card-info-title'>互联网医院</View>
          <View className='nav-card-info-desc'>专家在线指导</View>
        </View>
      </View>
      <View className='nav-card-right'>
          <Image className='nav-card-icon' src='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/new_home_icon13.png'></Image>
          <View className='nav-card-info'>
            <View className='nav-card-info-title'>互联网护理</View>
            <View className='nav-card-info-desc'>专家在线服务</View>
          </View>
        </View>
    </View>
  )
}