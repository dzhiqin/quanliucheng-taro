import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { AtSegmentedControl } from 'taro-ui'
import { useState, useEffect } from 'react'
import { REG_TYPE } from '@/enums/index'
import { fetchRegisterNotice } from '@/service/api/card-api'
import BkButton from '@/components/bk-button/bk-button'
import './notice.less'
import BkLoading from '@/components/bk-loading/bk-loading'

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
  const [busy,setBusy] = useState(false)
  useEffect(() => {
    Taro.setStorageSync('isReg', REG_TYPE.introday)
  },[])
  Taro.useDidShow(() => {
    setBusy(true)
    fetchRegisterNotice().then((res) => {
      if(res.resultCode === 0){
        setBusy(false)
        const notices = res.data
        const appointmentRTStr = notices.find(item => item.typeStr === '预约挂号须知').content
        const introdayRTStr = notices.find(item => item.typeStr === '当天挂号须知').content
        setAppointmentNoticeHtml(appointmentRTStr)
        setIntrodayNoticeHtml(introdayRTStr)
      }
    }) 
  })
  const renderContent = () => {
    if(current === 0){
      return <View dangerouslySetInnerHTML={{__html: introdayNoticeHtml}}></View>
    }else if(current === 1){
      return <View dangerouslySetInnerHTML={{__html: appointmentNoticeHtml}}></View>
    }
  }
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
      {
        busy &&
        <BkLoading loading={busy} msg='加载中...' />
      }
      {
        !busy &&
        <View>
          {renderContent()}
          <View style='padding: 40rpx'>
            <BkButton title='立即挂号' onClick={onClick} />
          </View>
        </View>
        
      }
    </View>
  )
}