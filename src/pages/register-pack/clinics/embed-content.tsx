import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import './embed-content.less'
import { fetchClinicsByDeptId,fetchDoctorsByDept, fetchScheduleDays } from '@/service/api'
import { AtList, AtListItem } from "taro-ui"
import { toastService } from '@/service/toast-service'
import BkLoading from '@/components/bk-loading/bk-loading'

export default function EmbedContent(props:{
  deptId: string,
  onClickDept: Function,
  onClickDate: Function,
  style?: string
}) {
  const{ deptId, onClickDept, onClickDate } = props
  const [current,setCurrent] = useState(0)
  const [clinics,setClinics] = useState([])
  const [doctors,setDoctors] = useState([])
  const [days,setDays] = useState([])
  const isReg = Taro.getStorageSync('isReg')
  const onClickDeptItem = (e) => {
    if(typeof onClickDept === 'function'){
      onClickDept(e)
    }
  }
  const onClickDoctorItem = (doctor) => {
    const {deptId: doctorDeptId,deptName,doctorId} = doctor
    const obj = {
      deptId: doctorDeptId,
      deptName,
      doctorId
    }
    Taro.navigateTo({url: `/pages/register-pack/doctor-detail/doctor-detail?options=${JSON.stringify(obj)}`})
  }
  const onClickDateItem = (date) => {
    if(typeof onClickDate === 'function'){
      onClickDate(date)
    }
  }
  useEffect(() => {
    fetchScheduleDays().then(res => {
      if(res.resultCode === 0){
        setDays(res.data)
      }else{
        toastService({title: '获取日期失败'})
      }
    })
  },[])
  useEffect(() => {
    if(!deptId) return
    fetchClinicsByDeptId({deptId}).then(res => {
      if(res.resultCode === 0){
        setClinics(res.data)
        if(res.data.length === 0){
          setCurrent(1)
        }else{
          setCurrent(0)
        }
      }else{
        toastService({title: '获取分类失败'})
      }
    })
    fetchDoctorsByDept({deptId}).then(res => {
      if(res.resultCode === 0){
        setDoctors(res.data)
      }else{
        toastService({title: '获取医生数据失败'})
      }
    })
  },[deptId])
  const renderOptionData = () => {
    switch(current){
      case 0: 
      if(!clinics.length) return <BkLoading size='small' />
      return(
        <AtList className='embed-content-list'>
          {
            clinics.map((clinic,index) => 
              <AtListItem key={index} title={clinic.specializedSubject} arrow='right' iconInfo={{ size: 20, color: '#22BCA2', value: 'bookmark', }} onClick={onClickDeptItem.bind(null,clinic)} />
            )
          }
        </AtList>
      );
      case 1: 
      if(!doctors.length) return <BkLoading size='small' />
      return (
        <AtList className='embed-content-list'>
          {
            doctors.map((doctor,index) => 
              <AtListItem key={doctor.doctorId} title={doctor.doctorName} note={doctor.title} arrow='right' thumb={doctor.faceUrl} onClick={onClickDoctorItem.bind(null,doctor)} />
            )
          }
        </AtList>
      );
      case 2: 
      if(!days.length) return <BkLoading size='small' />
      return (
        <AtList className='embed-content-list'>
          {
            days.map((day,index) => 
              <AtListItem key={index} title={day.date} arrow='right' iconInfo={{ size: 20, color: '#22BCA2', value: 'calendar' }} onClick={onClickDateItem.bind(null, day.date)} />
            )
          }
        </AtList>
      )
    }
  }
  return(
    <View className='embed-content' style={props.style ? props.style : ''}>
      <View className='filter'>
        {
          clinics.length > 0 &&
          <View className={`filter-item ${current === 0 ? 'filter-item-active' : ''}`} onClick={() => setCurrent(0)}>分类</View>
        }
        <View className={`filter-item ${current === 1 ? 'filter-item-active' : ''}`} onClick={() => setCurrent(1)}>医生</View>
        {// 当天挂号 屏蔽日期选择
          isReg !== '1' &&
          <View className={`filter-item ${current === 2 ? 'filter-item-active' : ''}`} onClick={() => setCurrent(2)}>日期</View>
        }
      </View>
      {
        renderOptionData()
      }
    </View>
  )
}