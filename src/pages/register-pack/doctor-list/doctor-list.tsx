import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import { useRouter } from '@tarojs/taro'
import { getDoctorsByDefault, getDoctorsByDate } from '@/service/api'
import WeekSchedule from '@/components/week-schedule/week-schedule'
import DoctorSchedule from '@/components/doctor-schedule/doctor-schedule'

export default function DoctorList() {
  const router = useRouter()
  const [week,setWeek] = useState()
  const [doctors,setDoctors] = useState([])
  const [defaultDay,setDefaultDay] = useState()
  const [selectedDate,setSelectedDate] = useState()
  const [deptId, setDeptId] = useState()
  const onDateChange = (e) => {
    setSelectedDate(e)
  }
  useEffect(() => {
    const _deptId = JSON.parse(router.params.deptId).toString()
    const hospitalInfo = Taro.getStorageSync('hospitalInfo')
    setDeptId(_deptId)
    getDoctorsByDefault({deptId: _deptId,branchId: hospitalInfo.branchId}).then(res => {
      console.log(res);
      if(res.resultCode === 0){
        setWeek(res.data.regDays)
        setDoctors(res.data.timeSlices)
        setDefaultDay(res.data.defaultSelectedDay)
      }
      
    })
  },[router.params.deptId])
  useEffect(() => {
    if(!deptId || !selectedDate) return
    const hospitalInfo = Taro.getStorageSync('hospitalInfo')
    getDoctorsByDate({deptId, branchId: hospitalInfo.branchId, regDate: selectedDate}).then(res => {
      console.log(res);
      if(res.resultCode === 0){
        setDoctors(res.data)
      }
    })
  }, [selectedDate,deptId])
  return(
    <View className='doctor-list'>
      <View style='padding: 20rpx 40rpx; background: white'>
        <WeekSchedule week={week} defaultDay={defaultDay} onChange={onDateChange} />
      </View>
      <View style='padding: 40rpx; background: #f5f5f5'>
        {
          doctors.map((doctor) => 
            <DoctorSchedule key={doctor.doctorId} style='margin-bottom: 40rpx' doctor={doctor}  />
          )
        }
      </View>
    </View>
  )
}