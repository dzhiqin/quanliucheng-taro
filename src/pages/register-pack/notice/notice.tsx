import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, RichText } from '@tarojs/components'
import { AtSegmentedControl } from 'taro-ui'
import { useState, useEffect } from 'react'
import { REG_TYPE } from '@/enums/index'
import { fetchRegisterNotice } from '@/service/api/card-api'
import BkButton from '@/components/bk-button/bk-button'
// import IntrodayRegNotice from './introday-reg-notice'
// import PreRegNotice from './pre-reg-notice'
import './notice.less'

export default function Notice() {
  const handleClick = (e) => {
    setCurrent(e)
    // IsReg 当天挂号1  预约挂号0
    Taro.setStorageSync('isReg', e === 0 ? REG_TYPE.introday : REG_TYPE.appointment)
  }
  const [current,setCurrent] = useState(0)
  const onClick = () => {
    Taro.redirectTo({url: '/pages/register-pack/clinics/clinics'})
  }
  const [appointmentNoticeHtml,setAppointmentNoticeHtml] = useState(undefined)
  const [introdayNoticeHtml,setIntrodayNoticeHtml] = useState(undefined)
  useEffect(() => {
    Taro.setStorageSync('isReg', REG_TYPE.introday)
  },[])
  Taro.useDidShow(() => {
    fetchRegisterNotice().then((res) => {
      if(res.resultCode === 0){
        const notices = res.data
        setAppointmentNoticeHtml(notices.find(item => item.typeStr === '预约挂号须知').content)
        setIntrodayNoticeHtml(notices.find(item => item.typeStr === '当天挂号须知').content)
      }
    }) 
  })
  return(
    <View style='padding: 20rpx;'>
      <View>
        <AtSegmentedControl
          onClick={handleClick.bind(this)}
          fontSize={34}
          current={current}
          values={['当天挂号', '预约挂号']}
        />
      </View>
      
      {/* {
        current === 0 
        ? <IntrodayRegNotice />
        : <PreRegNotice />
      } */}
      {
        current === 0 
        ? <RichText nodes={introdayNoticeHtml} />
        : <RichText nodes={appointmentNoticeHtml} />
      }
      <View style='padding: 40rpx'>
        <BkButton title='立即挂号' onClick={onClick} />
      </View>

    </View>
  )
}