import * as React from 'react'
import { View, Image } from '@tarojs/components'
import crossPng from '@/images/icons/cross.png'

import './clinics.less'

export default function DoctorCard() {
  return(
    <View className='doctor-card'>
      <Image className='doctor-avatar' src={crossPng} ></Image>
      <View className='doctor-info'>
        <View className='doctor-name'>华佗</View>
        <View className='doctor-clinic'>内科</View>
      </View>
      <View className='tag'>挂过</View>
    </View>
  )
}