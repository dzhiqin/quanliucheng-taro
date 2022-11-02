import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { useRouter } from '@tarojs/taro'
import { useEffect,useState } from 'react'
import { fetchReportsDetail } from '@/service/api/reports-api'
import { REPORT_ITEM_TYPE_CN,REPORT_TYPE_EN } from '@/enums/index'
import './reports-detail.less'
import { toastService } from '@/service/toast-service'
import BkLoading from '@/components/bk-loading/bk-loading'
import TestReport from './test-report'
import AltraSoundReport from './ultrasound-report'
import DefaultReport from './default-report'

export default function ReportsDetail() {
  const router = useRouter()
  const [checkItems,setCheckItems] = useState([])
  const params = router.params as {examId: string,examDate: string, itemType: REPORT_ITEM_TYPE_CN, reportType: REPORT_TYPE_EN}
  const {examId, examDate, itemType, reportType} = params
  const [busy,setBusy] = useState(false)
  useEffect(() => {
    setBusy(true)
    fetchReportsDetail({examId,examDate,itemType,reportType}).then(res => {
      if(res.resultCode === 0){
        setCheckItems(res.data.checkItems)
        setBusy(false)
      }else{
        setBusy(false)
        toastService({title: res.message})
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  },[examDate,examId,itemType,reportType])


  if(checkItems.length === 0){
    return <BkLoading loading={busy} ></BkLoading>
  }else if( itemType === REPORT_ITEM_TYPE_CN.化验) {
    return <TestReport checkItems={checkItems} examId={examId} itemType={itemType} />
  }else if( itemType === REPORT_ITEM_TYPE_CN.产前超声) {
    return <AltraSoundReport checkItems={checkItems} examId={examId} itemType={itemType} />
  }else {
    return <DefaultReport checkItems={checkItems} examId={examId} itemType={itemType} />
  }
}