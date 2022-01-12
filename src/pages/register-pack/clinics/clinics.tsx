import * as React from 'react'
import { View, Image } from '@tarojs/components'
import * as Taro from '@tarojs/taro'
import { useState,useEffect } from 'react'
import locationPng from '@/images/icons/location2.png'
import { AtSearchBar } from 'taro-ui'
import { fetchDepatmentList, fetchPreviousVisits } from '@/service/api'
import { toastService } from '@/service/toast-service'
import custom from '@/custom/index'
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
  const [currentDept,setCurrentDept] = useState(0)
  const hospitalInfo = Taro.getStorageSync('hospitalInfo')
  
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
        setDeptId(deptListData[0].deptId)
        const clinicData = deptListData ? deptListData[0].secondDeptInfos : []
        setClinicList(clinicData)
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
    if(item.deptId !== deptId){
      setCurrentDept(index)
      setDeptId(item.deptId)
      Taro.setStorageSync('deptInfo',item)
      toastService({title: `已选择${item.deptName}`,duration: 800})
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
      <View className='header'>
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
        <View className='previous'>
          {
            doctors.map((item,index) => <DoctorCard key={index} doctor={item} />)
          }
        </View>
      }
      <View className='clinics-content'>
        {
          deptList.length > 0 && <BkVerticalTab list={deptList} name='deptName' current={currentDept} key='deptId' style='flex: 2' onChange={onTabChange} />
        }
        {
          registerConfig.type === 'embed' && <EmbedContent deptId={deptId} style='flex: 3' onClickItem={onClickClinicItem} onClickDate={onClickDate} />
        }
        {
          registerConfig.type === 'tabs' && <ClinicList />
        }
      </View>
    </View>
  )
}