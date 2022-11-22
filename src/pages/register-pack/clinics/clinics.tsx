import * as React from 'react'
import { View, Image, ScrollView } from '@tarojs/components'
import * as Taro from '@tarojs/taro'
import { useState,useEffect } from 'react'
import locationPng from '@/images/icons/location2.png'
import { AtSearchBar } from 'taro-ui'
import { fetchDepatmentList, fetchPreviousVisits } from '@/service/api'
import { toastService } from '@/service/toast-service'
import {custom} from '@/custom/index'
import BkVerticalTab from '@/components/bk-vertical-tab/bk-vertical-tab'
import ClinicList from './clinic-list'
import EmbedContent from './embed-content'
import DoctorCard from './doctor-card'
import './clinics.less'

export default function Clinics() {
  const registerConfig = custom.feat.register
  const [value,setValue] = useState('')
  const [deptList,setDeptList] = useState([])
  const [doctors,setDoctors] = useState([])
  const [clinicList,setClinicList] = useState([])
  const [deptId,setDeptId] = useState()
  const [currentDept,setCurrentDept] = useState(null)
  const hospitalInfo = Taro.getStorageSync('hospitalInfo')
  
  Taro.useReady(() => {
    const isReg = Taro.getStorageSync('isReg')
    if(isReg === '0'){
      Taro.setNavigationBarTitle({title: '预约挂号'})
    }
    if(isReg === '1'){
      Taro.setNavigationBarTitle({title: '当天挂号'})
    }
  })
  useEffect(() => {
    fetchPreviousVisits().then(result => {
      if(result.resultCode === 0){
        setDoctors(result.data)
      }
    })
    fetchDepatmentList().then(result => {
      if(result.resultCode === 0){
        const deptListData = result.data.firstDeptInfos
        setDeptList(deptListData)
        Taro.setStorageSync('deptInfo',deptListData[0])
        // 特殊处理
        if(custom.hospName !== 'gysylw' || deptListData[0].deptName !== '生殖助孕'){
          setDeptId(deptListData[0].deptId)
        }
        const clinicData = deptListData ? deptListData[0].secondDeptInfos : []
        setClinicList(clinicData)
      }else{
        toastService({title: '获取科室信息失败'})
      }
    })
  },[])
  const onChange = (e) => {
    setValue(e)
  }
  const onActionClick = () => {
    const searchValue = value.trim()
    if(searchValue){
      Taro.navigateTo({url: '/pages/register-pack/search-result/search-result?value='+searchValue})
    }else{
      toastService({title: '请输入医生或科室'})
    }
    
  }
  const onTabChange = (item,index) => {
    if(custom.hospName === 'gysylw' && item.deptName === '生殖助孕'){
      // 特殊处理广三老院区荔湾的生殖助孕门诊
      Taro.navigateTo({url: '/pages/bind-pack/cards-list/cards-list?action=jumpOut'})
      return
    }
    setCurrentDept(index)
    setDeptId(item.deptId)
    Taro.setStorageSync('deptInfo',item)
    if(item.secondDeptInfos && item.secondDeptInfos.length){
      setClinicList(item.secondDeptInfos)
    }else{
      if(registerConfig.type === 'byDept'){
        // 没有二级科室，直接跳转到医生列表
        Taro.navigateTo({url: `/pages/register-pack/doctor-list/doctor-list?deptId=${item.deptId}&deptName=${item.deptName}`})
        setClinicList([])
      }
      
    }
  }

  const onClickClinicItem = (e) => {
    Taro.navigateTo({
      url: `/pages/register-pack/classify-doctor-list/classify-doctor-list?deptId=${deptId}&clinic=${e.specializedSubject}`
    })
  }
  const onClickDate = (date:string) => {
    Taro.navigateTo({
      url: `/pages/register-pack/classify-doctor-list/classify-doctor-list?deptId=${deptId}&date=${date}`
    })
  }
  return(
    <View className='clinics'>
      <View className='header' id='header'>
        <Image src={locationPng} className='header-icon' />
        <View className='header-title'>{hospitalInfo.hospitalName}</View>
      </View>
      <View className='search'>
        <AtSearchBar
          placeholder='搜索科室、医生'
          actionName='搜索'
          onChange={onChange}
          onActionClick={onActionClick}
          value={value}
        />
      </View>
      {
        doctors.length > 0 && 
        <View className='previous' id='previous'>
          {
            doctors.map((item,index) => <DoctorCard key={index} doctor={item} />)
          }
        </View>
      }
      {
        registerConfig.type === 'byCategoryAndDoctorAndTime' && 
        <View className='clinics-content'>
          <BkVerticalTab list={deptList} name='deptName' current={currentDept} key='deptId' style='flex:2' onChange={onTabChange} />
          <EmbedContent deptId={deptId} style='flex: 3' onClickDept={onClickClinicItem} onClickDate={onClickDate} />
        </View>
      }
      {
        registerConfig.type === 'byDept' &&
        <View className='clinics-content'>
          <BkVerticalTab list={deptList} name='deptName' current={currentDept} key='deptId' style='flex: 2' onChange={onTabChange} />
          {
            registerConfig.departmentLevel === '2' &&
            <ScrollView className='clinics-list' style='flex: 2' scrollY>
              <ClinicList  clinics={clinicList} />
            </ScrollView>
          }
        </View>
      }
      {
        registerConfig.type === 'byDeptAndTime' &&
        <View>developing</View>
      }
    </View>
  )
}