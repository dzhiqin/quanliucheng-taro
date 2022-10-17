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
  let [count,setCount] = useState(10)
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
  const startTimer = () => {
    setTimeout(() => {
      if(count > 0){
        setCount(--count)
        startTimer()
      }
    },1100)
  }
  React.useEffect(() => {
    startTimer()
  }, [count])
  const renderCountdownBtn = () => {
    return(
      <View className='arrival-btns'>
        <AtButton  circle type='secondary' onClick={handleRefresh} disabled={count ? true : false} >{count ? `(${count})` : ''}刷新距离</AtButton>
      </View>
    )
  }
  const getList = () => {
    setLoading(true)
    fetchCheckInInfo().then(res => {
      if(res.resultCode === 0){
        setList(res.data)
        // setList([
        //   {
        //     deptName: '科室名称',
        //     doctor: '陈医生',
        //     // clinicType: '好别',
        //     // address: '科室地址科室地址科室地址',
        //     visitDate: '2022-10-10',
        //     visitTimeDesc: '09:00-12:22'
        //   }
        // ])
      }
    }).finally(() => {
      setLoading(false)
    })
  }
  const refreshDistance = () => {
    setCount(10)
    setDistance(null)
    TaroGetLocation({type: 'gcj02'}).then((res:any) => {
      const {latitude,longitude} = res
      computeDistance(latitude,longitude,hospLatLong.latitude,hospLatLong.longitude)
    }).catch(err => {
      toastService({title: '获取位置失败：' + err})
    }).finally(() => {
    }) 
  }
  const renderBkLoading = () => {
    return(<BkLoading loading={loading} msg='暂无报到内容' />)
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
        {/* <View>
          目标经度：{hospLatLong.longitude}
        </View>
        <View>
          目标纬度：{hospLatLong.latitude}
        </View> */}
        <View className='arrival-hosp-desc'>距离院区：{distance}米</View>
        {
          renderCountdownBtn()
        }
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
                  {
                    item.clinicType &&
                    <View className='arrival-content-item'>
                      <View className='flat-title'>号别：</View>
                      <View className='arrival-content-item-text'>{item.clinicType}</View>
                    </View>
                  }
                  {
                    item.address &&
                    <View className='arrival-content-item'>
                      <View className='flat-title'>科室地址：</View>
                      <View className='arrival-content-item-text'>{item.address}</View>
                    </View>
                  }
                  
                  <View className='arrival-content-item'>
                    <View className='flat-title'>就诊时间：</View>
                    <View className='arrival-content-item-text'>{item.visitDate} {item.visitTimeDesc}</View>
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
          renderBkLoading()
        }
      </View>
    </View>
  )
}