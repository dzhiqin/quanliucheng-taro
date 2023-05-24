import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import { useRouter, useDidShow, useDidHide, useReady } from '@tarojs/taro'
import { fetchDoctorsByDefault, fetchDoctorsByDate, TaroNavigateService } from '@/service/api'
import ScheduleDays from '@/pages/register-pack/components/schedule-days/schedule-days'
import DoctorSchedule from '@/pages/register-pack/components/doctor-schedule/doctor-schedule'
import crossFlagPng from '@/images/icons/cross_flag.png'
import './doctor-list.less'
import BkLoading from '@/components/bk-loading/bk-loading'
import BaseModal from '@/components/base-modal/base-modal'
import { CARD_ACTIONS } from '@/enums/index'

export default function DoctorList() {
  const router = useRouter()
  const params = router.params
  const [week,setWeek] = useState()
  const [doctors,setDoctors] = useState([])
  const [defaultDay,setDefaultDay] = useState()
  const deptId = params.deptId
  const [busy,setBusy] = useState(false)
  const [show,setShow] = useState(false)
  const [doctorInfo,setDoctorInfo] = useState({
    doctorName: '',
    specialty: '',
    title: ''
  })
  const deptName = params.deptName || ''
  const onDateChange = (e) => {
    setDefaultDay(e)
    getDoctorsBySelectedDate(e)
  }
  useReady(() => {
    if(!Taro.getStorageSync('token')) return
    getScheduleDays()
  })
  useDidShow(() => {
    if(Taro.getStorageSync('token')) return
    Taro.eventCenter.on(CARD_ACTIONS.UPDATE_ALL, () => {
      !week &&getScheduleDays()
    })
  })
  useDidHide(() => {
    Taro.eventCenter.off(CARD_ACTIONS.UPDATE_ALL)
  })
  const getScheduleDays = () => {
    setBusy(true)
    fetchDoctorsByDefault({deptId}).then(res => {
      if(res.resultCode === 0){
        setWeek(res.data.regDays)
        setDoctors(res.data.timeSlices)
        if(res.data.defaultSelectedDay !== '无剩余号源'){
          setDefaultDay(res.data.defaultSelectedDay)
          getDoctorsBySelectedDate(res.data.defaultSelectedDay)
        }
      }
      setBusy(false)
    })
  }
  const getDoctorsBySelectedDate = (date) => {
    setBusy(true)
    setDoctors([])
    fetchDoctorsByDate({deptId, regDate: date}).then(res => {
      if(res.resultCode ===0){
        setDoctors(res.data)
      }
      setBusy(false)
    })
  }
  
  const handleClickDoctor = (e) => {
    const obj = {
      doctorId: e.doctorId,
      regDate: defaultDay,
      deptId: deptId,
      deptName: deptName,
      sourceType: e.sourceType
    }
    TaroNavigateService(`/pages/register-pack/doctor-detail/doctor-detail?options=${JSON.stringify(obj)}`)
  }
  const handleShowSpecialty = (info) => {
    setShow(true)
    setDoctorInfo(info)
  }
  return(
    <View className='doctor-list'>
      <View className='doctor-list-dept'>
        <Image src={crossFlagPng} className='doctor-list-dept-icon' mode='aspectFill'></Image>
        <View className='doctor-list-dept-name'>{deptName}</View>
      </View>
       <ScheduleDays showMonth days={week} defaultDay={defaultDay} onChange={onDateChange} />
      <View>
        {
          doctors.length > 0 
          ?
          <View style='padding: 40rpx; background: #f5f5f5'>
            {
              doctors.map((doctor) => 
                <DoctorSchedule 
                  key={doctor.doctorId} 
                  style='margin-bottom: 40rpx' 
                  doctor={doctor} 
                  onClick={handleClickDoctor}  
                  onShowDetail={handleShowSpecialty}
                />
              )
            }
          </View>
          :
          <BkLoading loading={busy} />
        }
      </View>
      <BaseModal show={show} custom closeOutside cancel={() => setShow(false)}>
        <View style='font-weight: bold;'>{doctorInfo.doctorName} {doctorInfo.title}</View>
        <View>擅长领域：{doctorInfo.specialty}</View>
      </BaseModal>
    </View>
  )
}