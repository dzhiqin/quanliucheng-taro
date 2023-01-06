import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { fetchDoctorDetail } from '@/service/api'
import { loadingService, modalService } from '@/service/toast-service'
import { useState } from 'react'
import BkTitle from '@/components/bk-title/bk-title'
import './doctor-detail.less'
import { getImageSrc } from '@/utils/image-src'
import { custom } from '@/custom/index'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'

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
    title: '',
    specializedSubject: ''
  })
  Taro.useDidShow(() => {
    loadingService(true)
    fetchDoctorDetail({deptId: params.deptId, doctorId: params.doctorId}).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setDoctorInfo(res.data)
      }else{
        modalService({content: res.message})
      }
    })
  })
  Taro.useReady(() => {
    if(custom.feat.guangHuaMonitor.enable){
      reportCmPV_YL({title: '专家介绍'})
    }
  })
  return(
    <View className='doctor-detail'>
      <View className='doctor-detail-header'>
        <Image src={doctorInfo.faceUrl || getImageSrc('default-avatar.png')} className='doctor-detail-avatar' mode='aspectFill'></Image>
        <View className='doctor-detail-name'>{doctorInfo.name}</View>
        <View className='doctor-detail-title'>{doctorInfo.title} {doctorInfo.specializedSubject}</View>
      </View>
      <BkTitle title='擅长领域' />
      <View className='doctor-detail-text'>{doctorInfo?.specialty?.replace(/<br>|<Br>/g, ' ') || '未填写'}</View>
      <BkTitle title='详细介绍' />
      <View className='doctor-detail-text'>{doctorInfo?.desc?.replace(/<br>|<Br>/g, ' ') || '未填写'}</View>
    </View>
  )
}