import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { fetchDoctorDetail } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import { useState } from 'react'
import { AtAvatar } from 'taro-ui'
import BkTitle from '@/components/bk-title/bk-title'
import './doctor-detail.less'
import defaultAvatar from '@/images/default_doctor.png'

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
        <AtAvatar image={doctorInfo.faceUrl || defaultAvatar} size='large' circle></AtAvatar>
        <View className='doctor-detail-name'>{doctorInfo.name}</View>
      </View>
      <BkTitle title='擅长领域' />
      <View>{doctorInfo.specialty || '完善中……'}</View>
      <BkTitle title='详细介绍' />
      <View>{doctorInfo.desc || '完善中……'}</View>
    </View>
  )
}