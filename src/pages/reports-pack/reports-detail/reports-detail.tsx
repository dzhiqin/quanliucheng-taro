import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useEffect,useState } from 'react'
import { fetchReportsDetail } from '@/service/api/reports-api'
import { REPORT_ITEM_TYPE_CN,REPORT_TYPE_EN } from '@/enums/index'
import {custom} from '@/custom/index'
import './reports-detail.less'
import BkButton from '@/components/bk-button/bk-button'
import { loadingService, toastService } from '@/service/toast-service'

export default function ReportsDetail() {
  const router = useRouter()
  const [checkItems,setCheckItems] = useState([])
  const reportsPage = custom.reportsPage
  const params = router.params as {examId: string,examDate: string, itemType: REPORT_ITEM_TYPE_CN, reportType: REPORT_TYPE_EN}
  const {examId, examDate, itemType, reportType} = params
  const [busy,setBusy] = useState(false)
  useEffect(() => {
    Taro.showLoading({title: '加载中……'})
    fetchReportsDetail({examId,examDate,itemType,reportType}).then(res => {
      if(res.resultCode === 0){
        setCheckItems(res.data.checkItems)
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  },[examDate,examId,itemType,reportType])
  const onClick = (e) => {
    Taro.previewImage({
      current: e,
      urls: [e]
    })
  }
  const handleViewPdf = () => {
    setBusy(true)
    const url = checkItems[0].url
    if(!url){
      toastService({title: 'pdf文件连接不存在'})
      return
    }
    loadingService(true)
    Taro.downloadFile({
      url: url,
      success: res => {
        const filePath = res.tempFilePath
        Taro.openDocument({
          filePath,
          showMenu: true,
          fileType: 'pdf',
          success: () => {
            console.log('open pdf success');
          },
          fail: err => {
            console.log('open pdf fail',err)
          },
          complete: () => {
            loadingService(false)
            setBusy(false)
          }
        })
      }
    })
  }
  return(
    <View className='reports-detail'>
      {
        reportsPage.urlDetail && itemType === REPORT_ITEM_TYPE_CN.产前超声 && 
        <BkButton title='查看PDF' onClick={handleViewPdf} loading={busy} />
      }
      {
        reportsPage.urlDetail && itemType !== REPORT_ITEM_TYPE_CN.产前超声 && 
        <View className='reports-detail-content'>
          <Image src={checkItems[0]? checkItems[0].url : ''} />
          <View className='reports-detail-footer'>
            {
              checkItems[0] && checkItems[0].url &&
              <BkButton title='查看图片' onClick={onClick.bind(null,checkItems[0]? checkItems[0].url : '')} />
            }
          </View>
        </View>
      }
      {
        !reportsPage.urlDetail &&
        <View>
          {
            checkItems.map((item,index) => 
              <View key={index}>
                <View>编号:</View>
                <View>{item.itemNo}</View>
              </View>
            )
          }
        </View>
      }
    </View>
  )
}