import * as React from 'react'
import { View, Image } from '@tarojs/components'
import nonePng from '@/images/icons/wu.png'
import './doctor-schedule.less'

export default function DoctorSchedule(props) {
  const onClick = () => {
    if(props.leaveTotalCount === 0) return
    console.log(props.doctor.doctorId);

  }
  return (
    <View className='doctor-schedule' style={props.style ? props.style : ''} onClick={onClick}>
      <Image src={props.doctor.faceUrl || nonePng} className='doctor-avatar' />
      <View className='doctor-content'>
        <View className='doctor-info'>
          <View className='doctor-info-name'>{props.doctor.doctorName}</View>
          <View className='doctor-info-title'>{props.doctor.title}</View>
        </View>
        <View className='doctor-fee'>￥{props.doctor.regFee}</View>
        <View className='doctor-major'>{props.doctor.specialty}</View>
      </View>
      <View>
        {
          props.doctor.leaveTotalCount > 0 ? 
          <View className='doctor-btn enable'>有号</View> :
          <View className='doctor-btn unable'>无号</View>
        }
      </View>
    </View>
  )
}