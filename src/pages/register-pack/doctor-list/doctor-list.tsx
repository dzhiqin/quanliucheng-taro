import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import { useRouter } from '@tarojs/taro'
import { fetchDoctorsByDefault, fetchDoctorsByDate } from '@/service/api'
import ScheduleDays from '@/components/schedule-days/schedule-days'
import DoctorSchedule from '@/components/doctor-schedule/doctor-schedule'
import crossFlagPng from '@/images/icons/cross_flag.png'
import './doctor-list.less'
import BkLoading from '@/components/bk-loading/bk-loading'

export default function DoctorList() {
  const router = useRouter()
  const params = router.params
  const [week,setWeek] = useState()
  const [doctors,setDoctors] = useState([])
  const [defaultDay,setDefaultDay] = useState()
  const [deptId, setDeptId] = useState(params.deptId || '')
  const [busy,setBusy] = useState(false)
  const deptName = params.deptName || ''
  const onDateChange = (e) => {
    setDefaultDay(e)
  }
  useEffect(() => {
    const _deptId = router.params.deptId
    setDeptId(_deptId)
    setBusy(true)
    fetchDoctorsByDefault({deptId: _deptId}).then(res => {
      if(res.resultCode === 0){
        setWeek(res.data.regDays)
        setDoctors(res.data.timeSlices)
        setDefaultDay(res.data.defaultSelectedDay)
      }
    }).finally(() => {
      setBusy(false)
    })
  },[router.params.deptId])
  useEffect(() => {
    if(!deptId || !defaultDay) return
    setBusy(true)
    setDoctors([])
    fetchDoctorsByDate({deptId, regDate: defaultDay}).then(res => {
      if(res.resultCode === 0){
        setDoctors(res.data)
      }
      setBusy(false)
    })
  }, [defaultDay,deptId])
  const handleClickDoctor = (e) => {
    Taro.navigateTo({url: `/pages/register-pack/doctor-detail/doctor-detail?doctorId=${e.doctorId}&regDate=${defaultDay}`})
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
                <DoctorSchedule key={doctor.doctorId} style='margin-bottom: 40rpx' doctor={doctor} onClick={handleClickDoctor}  />
              )
            }
          </View>
          :
          <BkLoading loading={busy} />
        }
      </View>
    </View>
  )
}