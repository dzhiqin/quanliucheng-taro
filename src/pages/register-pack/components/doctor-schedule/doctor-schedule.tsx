import * as React from 'react'
import { View, Image } from '@tarojs/components'
import './doctor-schedule.less'
import { getImageSrc } from '@/utils/image-src'

export default function DoctorSchedule(props) {
  const {onClick,onShowDetail} = props
  const handleClick = () => {
    if(props.leaveTotalCount === 0) return
    if(typeof onClick === 'function'){
      onClick(props.doctor)
    }
  }
  const handleClickSpecialty = (e) => {
    e.stopPropagation()
    if(typeof onShowDetail === 'function'){
      onShowDetail({doctorName: props.doctor.doctorName,specialty: props.doctor.specialty,title: props.doctor.title})
    }
  }
  return (
    <View className='doctor-schedule' style={props.style ? props.style : ''} onClick={handleClick}>
      <Image src={props.doctor.faceUrl || getImageSrc('default-avatar.png')} className='doctor-avatar' />
      <View className='doctor-content'>
        <View className='doctor-info'>
          <View className='doctor-info-name'>{props.doctor.doctorName}</View>
          <View className='doctor-info-title'>{props.doctor.title} {props.doctor.specializedSubject}</View>
        </View>
        {
          props.doctor.regFee &&
          <View className='doctor-fee'>￥{props.doctor.regFee}</View>
        }
        <View className='doctor-major' onClick={handleClickSpecialty}>{props.doctor.specialty}</View>
      </View>
      <View>
        {
          props.doctor.isHalt &&
          <View className='doctor-btn unable'>满诊</View>
        }
        {
          (!props.doctor.isHalt && props.doctor.leaveTotalCount > 0 && props.doctor.isTimePoint) ? 
          <View className='doctor-btn enable'>有号</View> :
          <View className='doctor-btn unable'>无号</View>
        }
      </View>
    </View>
  )
}