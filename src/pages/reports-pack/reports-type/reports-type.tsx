import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import BkPanel from '@/components/bk-panel/bk-panel'
import { reportType_EN } from '@/enums/index'

export default function ReportsType() {
  const onClickClinic = () => {
    Taro.navigateTo({url: '/pages/reports-pack/reports-list/reports-list?reportType='+ reportType_EN.clinic})
  }
  const onClickHospitalization = () => {
    Taro.navigateTo({url: '/pages/reports-pack/reports-list/reports-list?reportType='+ reportType_EN.hospitalization})
    
  }
  return(
    <View className='reports-type' style='padding: 40rpx'>
      <BkPanel arrow style='background: #3CC7B0; margin-bottom: 20rpx;color: white;' onClick={onClickClinic}>
        门诊报告
      </BkPanel>
      <BkPanel arrow style='background: #3CC7B0;color: white' onClick={onClickHospitalization}>
        住院报告
      </BkPanel>
    </View>
  )
}