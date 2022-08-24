import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import HealthCards from '@/components/health-cards/health-cards'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkNone from '@/components/bk-none/bk-none'
import { AtButton } from 'taro-ui'
import { useState } from 'react'
import { getWaitingList } from '@/service/api'
import { humanDate } from '@/utils/format'
import { toastService } from '@/service/toast-service'
import './waiting-list.less'

export default function BindingCard() {
  const [loading,setLoading] = useState(false)
  const [list,setList] = useState([])
  const handleRefresh = () => {
    getList()
  }
  const today = humanDate(new Date())
  const getList = () => {
    setLoading(true)
    Taro.showLoading({title: '加载中……'})
    getWaitingList({queueDate: today}).then(res => {
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        toastService({title: '获取数据失败：' + res.message})
      }
    }).finally(() => {
      setTimeout(() => {
        setLoading(false)
      }, 3000)
      Taro.hideLoading()
    })
  }
  Taro.useDidShow(() => {
    getList()
  })
  return(
    <View className='waiting-list'>
      <HealthCards switch />
      {
        list.length > 0 
        ?
        <View style='padding: 40rpx'>
          {
            list.map((item,index) => 
              <BkPanel key={index}>
                <View className='waiting-list-item'>
                  <View className='flat-title'>就诊科室：</View>
                  <View className='waiting-list-item-text'>{item.deptName}</View> 
                </View>
                <View className='waiting-list-item'>
                  <View className='flat-title'>医生姓名：</View>
                  <View className='waiting-list-item-text'>{item.doctorName}</View> 
                </View>
                <View className='waiting-list-item'>
                  <View className='flat-title'>号别：</View>
                  <View className='waiting-list-item-text'>{item.regType}</View> 
                </View>
                <View className='waiting-list-item'>
                  <View className='flat-title'>就诊时间：</View>
                  <View className='waiting-list-item-text'>{item.timeSliceName}</View> 
                </View>
                <View className='waiting-list-item'>
                  <View className='flat-title'>当前序号：</View>
                  <View className='waiting-list-item-text'>{item.regNo}</View> 
                </View>
                <View className='waiting-list-item'>
                  <View className='flat-title'>前方候诊：</View>
                  <View className='waiting-list-item-text'>{item.foreNum}</View> 
                </View>
              </BkPanel>
            )
          }
        </View>
        :
        <BkNone loading={loading} msg='暂无候诊数据' />
      }
      
      <View className='waiting-list-footer'>
        <AtButton loading={loading} full size='normal' type='primary' onClick={handleRefresh} >刷新数据</AtButton>
      </View> 
    </View>
  )
}