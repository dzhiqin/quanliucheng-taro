import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useDidShow, useRouter } from '@tarojs/taro'
import { useEffect,useState } from 'react'
import { fetchReportsDetail } from '@/service/api/reports-api'
import { REPORT_ITEM_TYPE_CN,REPORT_TYPE_EN } from '@/enums/index'
import './reports-detail.less'
import { loadingService, modalService } from '@/service/toast-service'
import BkLoading from '@/components/bk-loading/bk-loading'
import TestReport from './test-report'
import AltraSoundReport from './ultrasound-report'
import DefaultReport from './default-report'
import { custom } from '@/custom/index'
import GreenEnergyToast from '@/components/green-energy-toast/green-energy-toast'
import { handleGrantEnergy } from '@/service/api'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'

export default function ReportsDetail() {
  const router = useRouter()
  const [checkItems,setCheckItems] = useState([])
  const params = router.params as {pId: string,examId: string,examDate: string, itemType: REPORT_ITEM_TYPE_CN, reportType: REPORT_TYPE_EN}
  const {examId, examDate, itemType, reportType,pId} = params
  const [busy,setBusy] = useState(false)
  const [energy,setEnergy] = useState(0)
  const [showGreenToast,setShowGreenToast] = useState(true)
  useEffect(() => {
    setBusy(true)
    fetchReportsDetail({examId,examDate,itemType,reportType,pId}).then(res => {
      if(res.resultCode === 0){
        setCheckItems(res.data.checkItems)
        setBusy(false)
      }else{
        setBusy(false)
        modalService({content: res.message})
      }
      loadingService(false)
    })
  },[examDate,examId,itemType,reportType,pId])
  Taro.useReady(() => {
    if(custom.feat.guangHuaMonitor){
      reportCmPV_YL({title: '检查检验报告查询',params})
    }
  })
  useDidShow(() => {
    if(custom.feat.greenTree){
      handleGrantEnergy({scene: 'hoinquire', outerNo: examId}).then(res => {
        if(res.resultCode === 0){
          const {totalEnergy} = res.data
          if(totalEnergy){
            setEnergy(totalEnergy)
            setShowGreenToast(true)
          }
        }
      })
    }
  })

  // if(checkItems.length === 0){
  //   return <BkLoading loading={busy} ></BkLoading>
  // }else if( itemType === REPORT_ITEM_TYPE_CN.化验) {
  //   return <TestReport checkItems={checkItems} examId={examId} itemType={itemType} /> 
  // }else if( itemType === REPORT_ITEM_TYPE_CN.产前超声) {
  //   return <AltraSoundReport checkItems={checkItems} examId={examId} itemType={itemType} />
  // }else {
  //   return <DefaultReport checkItems={checkItems} examId={examId} itemType={itemType} />
  // }
  if(checkItems.length === 0){
    return <BkLoading loading={busy} ></BkLoading>
  }else{
    return (
      <View>
        {
          custom.feat.greenTree &&
          <GreenEnergyToast show={showGreenToast} energy={energy} text='本次查询获得绿色能量' />
        }
        {
          itemType === REPORT_ITEM_TYPE_CN.化验 &&
          <TestReport checkItems={checkItems} examId={examId} itemType={itemType} />
        }
        {
          itemType === REPORT_ITEM_TYPE_CN.产前超声 &&
          <AltraSoundReport checkItems={checkItems} examId={examId} itemType={itemType} />
        }
        {
          itemType !== REPORT_ITEM_TYPE_CN.化验 && itemType !== REPORT_ITEM_TYPE_CN.产前超声 &&
          <DefaultReport checkItems={checkItems} examId={examId} itemType={itemType} />
        }
      </View>
    )
  }
}