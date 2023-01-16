import * as React from 'react'
import { View } from '@tarojs/components'
import BkButton from '@/components/bk-button/bk-button'
import * as Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { updateUserInfo, fetchHealthCards, TaroNavigateService } from '@/service/api/'
import {custom} from '@/custom/index'
import { CardsHealper } from '@/utils/cards-healper'
import './login.less'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import { AtButton } from 'taro-ui'

export default function Login() {
  useEffect(() => {
    Taro.canIUse('hideHomeButton') && Taro.hideHomeButton()
  },[])
  const handleUpdateUserInfo = (data) => {
    updateUserInfo(data).then(result => {
      if(result.resultCode === 0){
        Taro.setStorageSync('userInfo',result.data)
        if(!result.data){
          modalService({content: '用户信息为空！'})
        }
      }else{
        modalService({
          title: '更新用户信息失败',
          content: result.message,
        })
      }
      // Taro.setStorageSync('userInfo','')
    })
  }
  const updateCardsAndNavigate = () => {
    loadingService(true)
    fetchHealthCards().then(result=>{
      loadingService(false)
      if(result.resultCode === 0){
        CardsHealper.saveCards(result.data).then(() => {
          Taro.redirectTo({url: process.env.TARO_ENV === 'weapp' ? '/pages/card-pack/cards-list/cards-list' : '/pages/card-pack/cards-list-alipay/cards-list-alipay'})
          // if(result.data.length === 0){
          //   Taro.redirectTo({url: process.env.TARO_ENV === 'weapp' ? '/pages/card-pack/cards-list/cards-list' : '/pages/card-pack/cards-list-alipay/cards-list-alipay'})
          // }else{
          //   Taro.navigateBack()
          // }
        })
      }else{
        if(custom.feat.bindCard.elecHealthCard){
          TaroNavigateService('card-pack','elec-healthcard-auth')
        }else{
          TaroNavigateService('card-pack','create-card')
        }
      }
    }).catch(err => {
      loadingService(false)
      modalService({content: JSON.stringify(err)})
    })
  }
  const onClick = () => {
    if(process.env.TARO_ENV === 'alipay'){
      updateCardsAndNavigate()
    }
    if(process.env.TARO_ENV === 'weapp'){
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
          handleUpdateUserInfo(data)
          updateCardsAndNavigate()
        },
        fail: (res) => {
          toastService({title: '您已拒绝授权'})
        }
      })
    }
    
  }
  const onGetUserInfo = (res) => {
    const {detail: {userInfo: {nickName, city, avatarUrl, country, province}}} = res
    const data = {
      nickName, city, avatarUrl, country, province
    }
    handleUpdateUserInfo(data)
    updateCardsAndNavigate()
  }
  const renderButton = () => {
    if(Taro.canIUse('getUserProfile')){
      return <BkButton title='授权用户信息' theme='primary' onClick={onClick}></BkButton>
    }else{
      return <AtButton type='primary' openType='getUserInfo' onGetUserInfo={onGetUserInfo} >授权用户信息</AtButton>
    }
  }
  return (
    <View className='login'>
      <View className='login-txt'>请授权用户信息</View>
      {renderButton()}
    </View>
  )
}