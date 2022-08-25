import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { fetchDoctorsBySubject, fetchDoctorsByDate } from '@/service/api'
import { useEffect, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import BkLoading from '@/components/bk-loading/bk-loading'
import { loadingService, toastService } from '@/service/toast-service'
import { AtList, AtListItem } from "taro-ui"
import './classify-doctor-list.less'
import crossFlagPng from '@/images/icons/cross_flag.png'

export default function ClassifyDoctorList(props) {
  const router = useRouter()
  const deptId = router.params.deptId
  const deptInfo = Taro.getStorageSync('deptInfo')
  const specializedSubject = router.params.clinic
  const regDate = router.params.date || ''
  const [list,setList] = useState([])
  const [busy,setBusy] = useState(false)
  const onClick = (doctor) => {
    if(doctor.isHalt){
      toastService({title: '已停诊'})
      return
    }
    if(doctor.leaveTotalCount === 0){
      toastService({title: '没号了~请重新选择'})
      return
    }
    Taro.navigateTo({url: `/pages/register-pack/doctor-detail/doctor-detail?doctorId=${doctor.doctorId}&regDate=${regDate}`})
  }
  
  useEffect(() => {
    if(!specializedSubject) return
    loadingService(true)
    fetchDoctorsBySubject({deptId,specializedSubject}).then(res => {
      if(res.resultCode === 0){
        loadingService(false)
        setList(res.data)
      }else{
        toastService({title: ''+res.message})
      }
    })
  },[deptId,specializedSubject])
  useEffect(() => {
    if(!regDate) return
    // loadingService(true)
    setBusy(true)
    fetchDoctorsByDate({deptId,regDate}).then(res => {
      if(res.resultCode === 0){
        loadingService(false)
        setList(res.data)
      }else{
        toastService({title: ''+res.message})
      }
      setBusy(false)
    })
  },[deptId,regDate])
  return(
    <View className='classify-doctor-list'>
      <View className='dept'>
        <Image src={crossFlagPng} className='dept-icon' />
        <View className='dept-name'>{deptInfo ? deptInfo.deptName : ''}</View>
      </View>
      {
        regDate && 
        <View className='date'>
          已选：
          <text className='date-value'>{regDate}</text>
        </View>
      }
      {
        list.length > 0 
        ? 
        <View className='content'>
          <AtList>
            {
              list.map((item,index)=>
                <AtListItem 
                  key={item.doctorId} 
                  title={item.doctorName} 
                  note={item.address} 
                  thumb={item.faceUrl} 
                  onClick={onClick.bind(null,item)} 
                  extraText={item.isHalt ? '停诊': !item.isTimePoint ? '无号' : item.leaveTotalCount >0 ? '有号' : '无号'} 
                  className={item.isHalt || !item.isTimePoint ? 'ticket-btn-unactive' : item.leaveTotalCount > 0 ? 'ticket-btn-active' : 'ticket-btn-unactive'}
                />
              )
            }
          </AtList>
        </View>
        : <BkLoading loading={busy} msg='没号了~' />
      }
    </View>
  )
}