import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { custom } from '@/custom/index'
import BkButton from '@/components/bk-button/bk-button'
import './reports-detail.less'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { fetchReportUrl } from '@/service/api/reports-api'
import { toastService, loadingService } from '@/service/toast-service'

export default function TestReport(props: {
  checkItems: any[],
  examId: string,
  itemType: REPORT_ITEM_TYPE_CN
}) {
  const setting = custom.reportsPage
  const {checkItems,examId,itemType} = props
  const [busy,setBusy] = React.useState(false)
  const onClick = (e) => {
    Taro.previewImage({
      current: e,
      urls: [e]
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
  const handleFetchPdfUrl = () => {
    setBusy(true)
    fetchReportUrl({examId,itemType}).then(res => {
      if(res.resultCode === 0){
        let url
        if(typeof res.data === 'object'){
          url = res.data[0]
        }else{
          url = res.data
        }
        handleViewPdf(url)
      }
    })
  }
  const handleViewPdf = (url) => {
    setBusy(true)
    // url = "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220927-basic/10070202108181.pdf"
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
        setting.showImageDetail && 
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
      {// 特殊处理
        custom.hospName === 'gysyhp' && 
        <AtButton type='primary' loading={busy} circle onClick={handleFetchPdfUrl}>查看pdf</AtButton>
      }
      {
        !setting.showImageDetail &&
        <View className='table'>
          <View className='at-row table-header'>
            <View className='at-col table-header-item at-col-4'>项目名称</View>
            <View className='at-col table-header-item at-col-2'>结果</View>
            <View className='at-col table-header-item at-col-2'>单位</View>
            <View className='at-col table-header-item at-col-2'>参考值</View>
            <View className='at-col table-header-item at-col-2'>参考结果</View>
          </View>
          {
            checkItems.map((item,index) => 
              <View className='at-row' key={index}>
                <View className='at-col table-body-item at-col-4'>{item.labRepItemName}{item.prompt ? '/'+item.prompt : ''}</View>
                <View className='at-col table-body-item at-col-2'>{item.labRepResult}</View>
                <View className='at-col table-body-item at-col-2'  style='font-size: 26rpx'>{item.labRepUnits}</View>
                <View className='at-col table-body-item at-col-2'>{item.labContext}</View>
                <View className='at-col table-body-item at-col-2'>
                  {getReferResult(item.labInd)}
                </View>
              </View>
            )
          }
        </View>
      }
    </View>
  )
}