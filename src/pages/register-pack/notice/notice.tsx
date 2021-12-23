import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { AtSegmentedControl } from 'taro-ui'
import { useState, useEffect } from 'react'
import { regType } from '@/enums/index'
import BkButton from '@/components/bk-button/bk-button'
import "taro-ui/dist/style/components/segmented-control.scss";
import IntrodayRegNotice from './introday-reg-notice'
import PreRegNotice from './pre-reg-notice'
import './notice.less'

export default function Notice() {
  const handleClick = (e) => {
    setCurrent(e)
    // IsReg 当天挂号1  预约挂号0
    Taro.setStorageSync('isReg', e === 0 ? regType.introday : regType.appointment)
  }
  const [current,setCurrent] = useState(0)
  const onClick = () => {
    Taro.redirectTo({url: '/pages/register-pack/clinics/clinics'})
  }
  useEffect(() => {
    Taro.setStorageSync('isReg', regType.introday)
  },[])
  return(
    <View>
      <AtSegmentedControl
        onClick={handleClick.bind(this)}
        fontSize={32}
        current={current}
        values={['当天挂号', '预约挂号']}
      />
      {
        current === 0 
        ? <IntrodayRegNotice />
        : <PreRegNotice />
      }
      <View style='padding: 40rpx'>
        <BkButton title='立即挂号' onClick={onClick} />
      </View>

    </View>
  )
}