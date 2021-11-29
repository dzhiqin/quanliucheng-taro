import { useContext,useState,useEffect } from 'react'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { MyContext } from '@/utils/my-context'
import { View } from '@tarojs/components'
import { getBranchHospital } from '@/service/api/register-api'
import custom from '@/custom/index'

import RegisterNoticeModal from '../register-notice-modal/register-notice-modal'
import BoxItem from './box-item'
import './function-boxes.less'

export default function FunctionBoxes(props) {
   const {functionBox} = useContext(MyContext)
   const [show,setShow] = useState(false)
   const [hospitalCount,setHospitalCount] = useState()
   const [hospitalInfo,setHospitalInfo] = useState({branchId: '',hospitalName: ''})
   const onItemClick = (event) => {
      if(event === 'toRegister'){
        if(custom.feat.register.popupNotice){
          setShow(true)
        }else{
          navToPage()
        }
      }
   }
 
    const onConfirm = () => {
      setShow(false)
      navToPage()
    }
    const navToPage = () => {
      if(hospitalCount === 1){
        Taro.navigateTo({
          url: `/pages/register-pack/clinics/clinics?banchId=${hospitalInfo.branchId}&hospitalName=${hospitalInfo.hospitalName}`
        })
      }else{
        Taro.navigateTo({
          url: '/pages/register-pack/branch-hospitals/branch-hospitals'
        })
      }
    } 
    useEffect(() => {
      getBranchHospital({branchId: ''}).then(res => {
        console.log('res',res);
        
        if(res.resultCode === 0){
          const hospital = res.data[0]
          setHospitalCount(res.data.length)
          setHospitalInfo({
            branchId: hospital.branchId,
            hospitalName: hospital.hospitalName
          })
        }
      })
     
    }, [])

    return (
      <View className='function-box-container'>
        {
          functionBox.list.map((item,index) => <BoxItem key={index} item={item} onClick={onItemClick.bind(this)}>list</BoxItem>)
        }
        {
          custom.feat.register.popupNotice && <RegisterNoticeModal show={show} onConfirm={onConfirm.bind(this)} />  
        }
      </View>
    )      
}