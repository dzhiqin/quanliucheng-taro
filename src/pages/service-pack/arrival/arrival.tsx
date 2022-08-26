import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import { AtButton } from 'taro-ui'
import { useState } from 'react'
import { fetchCheckInInfo, TaroGetLocation,handleCheckIn } from '@/service/api'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import BkTitle from '@/components/bk-title/bk-title'
import BkLoading from '@/components/bk-loading/bk-loading'
import { computeDistanceFromLatLong } from '@/utils/tools'
import { loadingService, toastService } from '@/service/toast-service'
import {custom} from '@/custom/index'
import './arrival.less'

export default function BindingCard() {
  const [loading,setLoading] = useState(false)
  const [showBtn,setShowBtn] = useState(true)
  const [list,setList] = useState([])
  const [hospLatLong,setHospLatLong] = useState({
    latitude: null,
    longitude: null
  })
  const [distance,setDistance] = useState(null)
  const handleRefresh = () => {
    if(loading) return
    refreshDistance()
  }
  const getList = () => {
    Taro.showLoading({title: '正在获取数据'})
    fetchCheckInInfo().then(res => {
      if(res.resultCode === 0){
        setList(res.data)
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }
  const refreshDistance = () => {
    setLoading(true)
    TaroGetLocation({type: 'gcj02'}).then((res:any) => {
      const {latitude,longitude} = res
      computeDistance(latitude,longitude,hospLatLong.latitude,hospLatLong.longitude)
    }).catch(err => {
      if(err.errMsg==='getLocation:fail auth deny'){
        Taro.showModal({
          content: '检测到您没有打开小程序的定位授权，是否手动打开？',
          confirmText: '确认',
          cancelText: '取消',
          success: result => {
            if(result.confirm){
              Taro.openSetting({
                success: openRes => {}
              })
            }else{
              Taro.navigateBack()
            }
          }
        })
      }else{
        toastService({title: '获取位置失败：' + err})
        console.log(err)
      }
    }).finally(() => {
      setTimeout(() => {
        setLoading(false)
      }, 10000)
    }) 
  }
  const computeDistance = (userLat,userLong,hospLat,hospLong) => {
    if(hospLat && hospLong){
      const value = computeDistanceFromLatLong(userLat,userLong,hospLat,hospLong)
      setDistance(value)
    }else{
      setHospLatLong({
        latitude: custom.latitude,
        longitude: custom.longitude
      })
      computeDistance(userLat,userLong,custom.latitude,custom.longitude)
      // fetchOfficialContent().then(res => {
      //   if(res.resultCode === 0 && res.data ){
      //     const hospInfo = res.data.hospInfo
      //     setHospLatLong({
      //       latitude: hospInfo.latitude,
      //       longitude: hospInfo.golden
      //     })
          
      //     computeDistance(userLat,userLong,hospInfo.latitude,hospInfo.golden)
      //   }else{
      //     toastService({title: '获取医院经纬度失败'})
      //   }
      // })
    }
    
  }
  Taro.useDidShow(() => {
    getList()
    refreshDistance()
  })
  const handleClick = (item:any) => {
    if(distance>200){
      toastService({title: '在院区200米内才可以报到'})
      return
    }
   
    loadingService(true,'报到中……')
    const { visitDate, visitNo, branchNo, hisOrderId, deptId } = item
    handleCheckIn({visitDate,visitNo,branchNo,hisOrderId,deptId}).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        Taro.showToast({title: '报到成功',icon:'success'})
        setShowBtn(false)
      }else{
        Taro.showToast({title: '报到失败' + res.message, icon: 'none'})
      }
    }).catch((err) => {
      toastService({title: '' + err})
    })
  }
  return(
    <View className='arrival'>
      <HealthCards switch />
      <View className='arrival-hosp'>
        <View>
          经度：{hospLatLong.longitude}
        </View>
        <View>
          维度：{hospLatLong.latitude}
        </View>
        <View>距离院区：{distance}米</View>
        <View className='arrival-btns'>
          <AtButton loading={loading} size='small' circle type='secondary' onClick={handleRefresh} >刷新数据</AtButton>
        </View>
      </View>
      <View className='arrival-content'>
        {
          list.length > 0
          ?
          <View>
            {
              !showBtn && 
              <BkTitle title='您已报到成功' />
            }
            {
              list.map((item,index) => 
                <BkPanel key={index}>
                  <View className='arrival-content-item'>
                    <View className='flat-title'>就诊科室：</View>
                    <View className='arrival-content-item-text'>{item.deptName}</View>
                  </View>
                  <View className='arrival-content-item'>
                    <View className='flat-title'>医生姓名：</View>
                    <View className='arrival-content-item-text'>{item.doctor}</View>
                  </View>
                  <View className='arrival-content-item'>
                    <View className='flat-title'>号别：</View>
                    <View className='arrival-content-item-text'>{item.clinicType}</View>
                  </View>
                  <View className='arrival-content-item'>
                    <View className='flat-title'>科室地址：</View>
                    <View className='arrival-content-item-text'>{item.address}</View>
                  </View>
                  <View className='arrival-content-item'>
                    <View className='flat-title'>就诊时间：</View>
                    <View className='arrival-content-item-text'>{item.visitDate} - {item.visitTimeDesc}</View>
                  </View>
                  <View className='arrival-content-action'>
                    {
                      showBtn &&
                      <BkButton title='报到' theme={`${distance <= 200 ? 'primary' : 'cancel'}`} onClick={handleClick.bind(null,item)} />
                    }
                  </View>
                </BkPanel>
              )
            }
          </View>
          :
          <BkLoading loading={loading} msg='暂无报到内容' />
        }
      </View>
      {/* <View className='arrival-footer'>
        <AtButton loading={loading} size='normal' type='primary' onClick={handleRefresh} >刷新数据</AtButton>
      </View> */}
    </View>
  )
}