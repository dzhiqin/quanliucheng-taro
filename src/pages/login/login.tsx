import * as React from 'react'
import { View } from '@tarojs/components'
import BkButton from '@/components/bk-button/bk-button'
import * as Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { updateUserInfo, getHealthCards } from '@/service/api/user-api'
import custom from '@/custom/index'
import Cards from '@/utils/cards'

import './login.less'

export default function Login() {
  useEffect(() => {
    Taro.canIUse('hideHomeButton') && Taro.hideHomeButton()
  })
  const onClick = () => {
    Taro.showLoading({
      title: '加载中……',
      mask: true
    })
    Taro.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        let rawData =JSON.parse(res.rawData) 
        const {
          nickName,
          gender,
          city,
          province,
          country,
          avatarUrl
        } = rawData
        const data = {
          nickName,gender,city,province,country,avatarUrl
        }
        updateUserInfo(data).then(result => {
          Taro.setStorageSync('userInfo',result.data)
          getHealthCards().then(object=>{
            Cards.saveCards(object.data)
          })
          if(custom.feat.bindCard.electronicHealthCard){
            Taro.navigateTo({
              url: '/pages/elec-healthcard-auth/elec-healthcard-auth'
            })
          }else{
            Taro.navigateTo({
              url: '/pages/bind-card/bind-card'
            })
          }
        })
      }
    })
  }
  
  return (
    <View className='login'>
      <View className='login-txt'>您尚未绑定账户，请点击账户绑定</View>
      <BkButton name='账户绑定' theme='primary' onClick={onClick}></BkButton>
    </View>
  )
}