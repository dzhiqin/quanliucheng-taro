import * as React from 'react'
import { View } from '@tarojs/components'
import BkButton from '@/components/bk-button/bk-button'
import * as Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { updateUserInfo, fetchHealthCards } from '@/service/api/'
import {custom} from '@/custom/index'
import { CardsHealper } from '@/utils/cards-healper'
import './login.less'
import { loadingService } from '@/service/toast-service'

export default function Login() {
  useEffect(() => {
    Taro.canIUse('hideHomeButton') && Taro.hideHomeButton()
  })
  const onClick = () => {
    loadingService(true)
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
        })

        fetchHealthCards().then(result=>{
          if(result.resultCode === 0){
            CardsHealper.saveCards(result.data).then(() => {
              if(result.data.length === 0){
                Taro.redirectTo({url: '/pages/bind-pack/bind-card/bind-card'})
              }else{
                Taro.navigateBack()
              }
            })
          }else{
            if(custom.feat.bindCard.electronicHealthCard){
              Taro.navigateTo({
                url: '/pages/bind-pack/elec-healthcard-auth/elec-healthcard-auth'
              })
            }else{
              Taro.navigateTo({
                url: '/pages/bind-pack/bind-card/bind-card'
              })
            }
          }
        }).finally(() => {
          Taro.hideLoading()
        })
      },
      fail: (res) => {
        Taro.showToast({title: '您已拒绝授权',icon: 'none'})
      }
    })
  }
  
  return (
    <View className='login'>
      <View className='login-txt'>您尚未绑定账户，请点击账户绑定</View>
      <BkButton title='账户绑定' theme='primary' onClick={onClick}></BkButton>
    </View>
  )
}