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
import BkPanel from '@/components/bk-panel/bk-panel'

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
  const getReferResult = (key) => {
    switch(key){
      case 'H': return '偏高';
      case 'L': return '偏低';
      case 'N': return '正常';
      default: return key;
    }
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
        !reportsPage.urlDetail && itemType !== REPORT_ITEM_TYPE_CN.化验 &&
        <View style='padding: 40rpx;'>
          {
            checkItems.map((item,index) => 
              <BkPanel key={index}>
                <View className='card-item'>
                  <View>检查编号:</View>
                  <View>{item.itemNo}</View>
                </View>
                <View className='card-item'>
                  <View>检查名称:</View>
                  <View>{item.examItemName}</View>
                </View>
                <View className='card-item'>
                  <View>检查结果:</View>
                  <View>{item.content}</View>
                </View>
                <View className='card-item'>
                  <View>结果描述:</View>
                  <View>{item.prompt}</View>
                </View>
              </BkPanel>
            )
          }
        </View>
      }
      {
        !reportsPage.urlDetail && itemType === REPORT_ITEM_TYPE_CN.化验 &&
        <View className='table'>
          <View className='at-row table-header'>
            <View className='at-col table-header-item'>项目名称</View>
            <View className='at-col table-header-item'>结果</View>
            <View className='at-col table-header-item'>单位</View>
            <View className='at-col table-header-item'>参考值</View>
            <View className='at-col table-header-item'>参考结果</View>
          </View>
          {
            checkItems.map((item,index) => 
              <View className='at-row' key={index}>
                <View className='at-col table-body-item table-body-scroll'>{item.labRepItemName}{item.prompt ? '/'+item.prompt : ''}</View>
                <View className='at-col table-body-item'>{item.labRepResult}</View>
                <View className='at-col table-body-item' style='font-size: 26rpx'>{item.labRepUnits}</View>
                <View className='at-col table-body-item table-body-scroll'>{item.labContext}</View>
                <View className='at-col table-body-item'>
                  {getReferResult(item.labInd)}
                </View>
                {/* <View className='card-item'>
                  <View>姓名:</View>
                  <View>{item.patientName}</View>
                </View>
                <View className='card-item'>
                  <View>性别:</View>
                  <View>{item.gender}</View>
                </View>
                <View className='card-item'>
                  <View>年龄:</View>
                  <View>{item.age}</View>
                </View>
                <View className='card-item'>
                  <View>报告医生:</View>
                  <View>{item.reportDoctorName}</View>
                </View>
                <View className='card-item'>
                  <View>报告时间:</View>
                  <View>{item.itemDate}</View>
                </View>
                <View className='card-item'>
                  <View>性别:</View>
                  <View>{item.gender}</View>
                </View> */}
              </View>
            )
          }
        </View>
      }
    </View>
  )
}