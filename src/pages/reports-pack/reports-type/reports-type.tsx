import * as React from 'react'
import { View } from '@tarojs/components'
import BkPanel from '@/components/bk-panel/bk-panel'
import { REPORT_TYPE_EN } from '@/enums/index'
import { custom } from '@/custom/index'
import { TaroNavigateService } from '@/service/api'

export default function ReportsType() {
  const onClickClinic = () => {
    TaroNavigateService('reports-pack','reports-list',`reportType=${REPORT_TYPE_EN.clinic}`)
  }
  const onClickHospitalization = () => {
    TaroNavigateService('reports-pack','reports-list',`reportType=${REPORT_TYPE_EN.hospitalization}`)
  }
  return(
    <View className='reports-type' style='padding: 40rpx'>
      <BkPanel arrow style='background: #3CC7B0; margin-bottom: 20rpx;color: white;' onClick={onClickClinic} iconColor='#fff'>
        门诊报告
      </BkPanel>
      {
        !custom.reportsPage.hideInHosp && 
        <BkPanel arrow style='background: #3CC7B0;color: white' onClick={onClickHospitalization} iconColor='#fff'>
          住院报告
        </BkPanel>
      }
      
    </View>
  )
}