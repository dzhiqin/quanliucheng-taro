import * as React from 'react'
import { View, Image } from '@tarojs/components'
import * as Taro from '@tarojs/taro'
import { useState,useEffect } from 'react'
import locationPng from '@/images/icons/location2.png'
import { AtSearchBar, AtTabs, AtTabsPane } from 'taro-ui'
import "taro-ui/dist/style/components/search-bar.scss"
import "taro-ui/dist/style/components/tabs.scss"
import { getDepatmentList, getPreviousVisits } from '@/service/api'
import ClinicList from './clinic-list'
import DoctorCard from './doctor-card'
import './clinics.less'

export default function Clinics() {
  const [value,setValue] = useState('')
  const [currentDept,setCurrentDept] = useState(0)
  const [deptList,setDeptList] = useState([])
  const [clinicList,setClinicList] = useState([])
  const [tabs,setTabs] = useState([])
  const [hospitalInfo,setHospitalInfo] = useState({
    hospitalName: '',
    branchId: ''
  })
  
  useEffect(() => {
    Taro.getSystemInfo().then(res => console.log(res))
    
    const res = Taro.getStorageSync('hospitalInfo')
    if(res){
      setHospitalInfo(res)
      getPreviousVisits({branchId: res.branchId}).then(result => {
        console.log('get previous',result);
        
      })
      getDepatmentList({branchId: res.branchId}).then(result => {
        if(result.resultCode === 0){
          const deptListData = result.data.firstDeptInfos
          setDeptList(deptListData)
          let tabsData = []
          deptListData && deptListData.forEach(ele => {
            tabsData.push({title: ele.deptName})
          });
          const clinicData = deptListData ? deptListData[0].secondDeptInfos : []
          setClinicList(clinicData)
          setTabs(tabsData)
        }
      })
    }
  },[])
  const onChange = (e) => {
    setValue(e)
  }
  const onActionClick = () => {
    console.log('action click',value);
    
  }
  const onDeptChange = (e) => {
    setCurrentDept(e)
    console.log('on Dept change',currentDept);

  }
  const onClickItem = (e) => {
    console.log(e);
    
  }
  return(
    <View className='clinics'>
      <View className='header'>
        <Image src={locationPng} className='header-icon' />
        <View className='header-title'>医院分院名称</View>
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
      <view className='previous'>
        <DoctorCard />
        <DoctorCard />
        <DoctorCard />
        <DoctorCard />
        <DoctorCard />
      </view>
      <View className='clinics-content'>
        <AtTabs
          current={currentDept}
          scroll
          height='850rpx'
          tabDirection='vertical'
          tabList={tabs}
          onClick={onDeptChange}
        >
          {
            deptList.map((deptEle,index) => 
              <AtTabsPane tabDirection='vertical' current={currentDept} index={index} key={index}>
                <View style='font-size:18px;text-align:center;height:850rpx;'>
                  <ClinicList key={index} clinics={deptEle.secondDeptInfos} />
                </View>
              </AtTabsPane>
            )
          }
        </AtTabs>
      </View>
    </View>
  )
}