import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { fetchDoctorDetail } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import { useState } from 'react'
import BkTitle from '@/components/bk-title/bk-title'
import './doctor-detail.less'
import defaultAvatar from '@/images/default-avatar.png'

export default function DoctorDetail() {
  const router = Taro.useRouter()
  const params = router.params
  const [doctorInfo,setDoctorInfo] = useState({
    deptName: '',
    desc: '',
    doctorId: '',
    faceUrl: '',
    name: '',
    specialty: '',
    title: ''
  })
  Taro.useDidShow(() => {
    loadingService(true)
    fetchDoctorDetail({deptId: params.deptId, doctorId: params.doctorId}).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setDoctorInfo(res.data)
      }else{
        toastService({title: '' + res.message})
      }
    })
  })
  return(
    <View className='doctor-detail'>
      <View className='doctor-detail-header'>
        <Image src={doctorInfo.faceUrl || defaultAvatar} className='doctor-detail-avatar' mode='aspectFill'></Image>
        <View className='doctor-detail-name'>{doctorInfo.name}</View>
        <View className='doctor-detail-title'>{doctorInfo.title}</View>
      </View>
      <BkTitle title='擅长领域' />
      <View className='doctor-detail-text'>{doctorInfo.specialty.replace(/<br>|<Br>/g, ' ') || '未填写'}</View>
      <BkTitle title='详细介绍' />
      <View className='doctor-detail-text'>{doctorInfo.desc.replace(/<br>|<Br>/g, ' ') || '未填写'}</View>
    </View>
  )
}