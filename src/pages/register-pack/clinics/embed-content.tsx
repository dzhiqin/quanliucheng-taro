import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import "taro-ui/dist/style/components/tabs.scss"
import './embed-content.less'
import { fetchClinicsByDeptId,fetchDoctorsByDept, fetchScheduleDays } from '@/service/api'
import { AtList, AtListItem } from "taro-ui"
// import "taro-ui/dist/style/components/icon.scss"
// import "taro-ui/dist/style/components/list.scss"
import { toastService } from '@/service/toast-service'
import BkNone from '@/components/bk-none/bk-none'

export default function EmbedContent(props) {
  const [current,setCurrent] = useState(0)
  const [clinics,setClinics] = useState([])
  const [doctors,setDoctors] = useState([])
  const [days,setDays] = useState([])
  const onClick = props.onClickItem
  const onClickDate = props.onClickDate
  const onClickItem = (e) => {
    if(typeof onClick === 'function'){
      onClick(e)
    }
  }
  const onClickDoctorItem = (doctorId) => {
    Taro.navigateTo({url: '/pages/register-pack/doctor-detail/doctor-detail?doctorId=' + doctorId})
  }
  const onClickDateItem = (date) => {
    // console.log(date);
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
    if(!props.deptId) return
    fetchClinicsByDeptId({deptId: props.deptId}).then(res => {
      if(res.resultCode === 0){
        setClinics(res.data)
      }else{
        toastService({title: '获取分类失败'})
      }
    })
    fetchDoctorsByDept({deptId: props.deptId}).then(res => {
      if(res.resultCode === 0){
        setDoctors(res.data)
      }else{
        toastService({title: '获取医生数据失败'})
      }
    })
  },[props.deptId])
  return(
    <View className='embed-content' style={props.style ? props.style : ''}>
      <View className='filter'>
        <View className={`filter-item ${current === 0 ? 'filter-item-active' : ''}`} onClick={() => setCurrent(0)}>分类</View>
        <View className={`filter-item ${current === 1 ? 'filter-item-active' : ''}`} onClick={() => setCurrent(1)}>医生</View>
        <View className={`filter-item ${current === 2 ? 'filter-item-active' : ''}`} onClick={() => setCurrent(2)}>日期</View>
      </View>
      {
        current === 0 &&
        <View>
          {
            clinics.length > 0 
            ? <AtList>
                {
                  clinics.map((clinic,index) => 
                    <AtListItem key={index} title={clinic.specializedSubject} arrow='right' iconInfo={{ size: 20, color: '#22BCA2', value: 'bookmark', }} onClick={onClickItem.bind(null,clinic)} />
                  )
                }
              </AtList>
            : <BkNone size='small' msg='当前科室暂无分类' />
          }
        </View>
      }
      {
        current === 1 &&
        <View>
          {
            doctors.length > 0
            ? <AtList>
                {
                  doctors.map((doctor,index) => 
                    <AtListItem key={doctor.doctorId} title={doctor.doctorName} note={doctor.title} arrow='right' thumb={doctor.faceUrl} onClick={onClickDoctorItem.bind(null,doctor.doctorId)} />
                  )
                }
              </AtList>
            : <BkNone size='small' />
          }
        </View>
      }
      {
        current === 2 &&
        <View>
          {
            days.length > 0
            ? <AtList>
                {
                  days.map((day,index) => 
                    <AtListItem key={index} title={day.date} arrow='right' iconInfo={{ size: 20, color: '#22BCA2', value: 'calendar' }} onClick={onClickDateItem.bind(null, day.date)} />
                  )
                }
              </AtList>
            : <BkNone size='small' />
          }
        </View>
      }
    </View>
  )
}