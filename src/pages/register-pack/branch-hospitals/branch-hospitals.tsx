import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useEffect } from 'react'
import { getBranchHospital } from '@/service/api/register-api'

export default function BranchHospitals() {
  useEffect(() => {
    getBranchHospital({branchId: ''}).then((res) => {
      // console.log('branch hospitals',res);
      if(res.resultCode === 0){
        if(res.data.length === 1){
          navToRegisterPage()
        }else{
          checkRegisterMode()
        }
      }
    })
  },[])
  const navToRegisterPage = () => {
    console.log('nav to register page');
    Taro.redirectTo({
      url: '/pages/register-pack/clinics/clinics'
    })
  }
  const checkRegisterMode = () => {
    console.log('check register mode');
    
  }
  return (
    <View>BranchHospitals</View>
  )
}