import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { fetchDoctorsBySubject, fetchDoctorsByDate, TaroNavigateService } from '@/service/api'
import { useEffect, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import BkLoading from '@/components/bk-loading/bk-loading'
import {  modalService, toastService } from '@/service/toast-service'
import { AtList, AtListItem } from "taro-ui"
import './clinic-doctors.less'
import crossFlagPng from '@/images/icons/cross_flag.png'

export default function ClinicDoctors(props) {
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
    const obj = {
      doctorId: doctor.doctorId,
      regDate: regDate,
      deptId: deptId,
      deptName: deptInfo.deptName
    }
    TaroNavigateService('register-pack','doctor-detail',`options=${JSON.stringify(obj)}`)
  }
  
  useEffect(() => {
    if(!specializedSubject) return
    setBusy(true)
    fetchDoctorsBySubject({deptId,specializedSubject}).then(res => {
      if(res.resultCode === 0){
        setList(res.data)
        setBusy(false)
      }else{
        setBusy(false)
        modalService({content: res.message})
      }
    })
  },[deptId,specializedSubject])
  useEffect(() => {
    if(!regDate) return
    setBusy(true)
    fetchDoctorsByDate({deptId,regDate}).then(res => {
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
      setBusy(false)
    })
  },[deptId,regDate])
  const renderTickets = (item) => {
    if(item.isHalt) return '停诊'
    if(!item.isTimePoint) return '无号'
    // eslint-disable-next-line no-restricted-globals
    if(isNaN(parseInt(item.leaveCount))) return item.leaveCount
    if(item.leaveCount > 9999) return '不限号' // 特殊处理
    if(item.leaveCount > 0) return `剩余:${item.leaveCount}`
    return '满号'
  }
  return(
    <View className='clinic-doctors'>
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
                  extraText={renderTickets(item)} 
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