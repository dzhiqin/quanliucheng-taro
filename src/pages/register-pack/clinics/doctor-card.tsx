import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import defaultAvatar from '@/images/default_doctor.png'
import './clinics.less'

export default function DoctorCard(props) {
  const onClick = () => {
    Taro.navigateTo({url: '/pages/register-pack/doctor-detail/doctor-detail?doctorId=' + props.doctor.doctorId})
  }
  return(
    <View className='doctor-card' onClick={onClick}>
      <Image className='doctor-avatar' src={props.doctor.faceUrl || defaultAvatar} ></Image>
      <View className='doctor-info'>
        <View className='doctor-name'>{props.doctor.doctorName}</View>
        <View className='doctor-clinic'>{props.doctor.deptName}</View>
      </View>
      <View className='tag'>挂过</View>
    </View>
  )
}