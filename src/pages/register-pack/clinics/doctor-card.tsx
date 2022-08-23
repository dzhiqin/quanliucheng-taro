import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './clinics.less'
import { getImageSrc } from '@/utils/image-src'

export default function DoctorCard(props) {
  const onClick = () => {
    Taro.setStorageSync('deptInfo',{deptId: props.doctor.deptId, deptName: props.doctor.deptName})
    Taro.navigateTo({url: `/pages/register-pack/doctor-detail/doctor-detail?doctorId=${props.doctor.doctorId}`})
  }
  return(
    <View className='doctor-card' onClick={onClick}>
      <Image className='doctor-avatar' src={props.doctor.faceUrl || getImageSrc('default-avatar.png')} ></Image>
      <View className='doctor-info'>
        <View className='doctor-name'>{props.doctor.doctorName}</View>
        <View className='doctor-clinic'>{props.doctor.deptName}</View>
      </View>
      <View className='tag'>挂过</View>
    </View>
  )
}