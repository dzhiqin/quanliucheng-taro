import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View,Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './reports-detail.less'
import BkPanel from '@/components/bk-panel/bk-panel'
import { custom } from '@/custom/index'
import { toastService, loadingService } from '@/service/toast-service'
import { fetchReportUrl } from '@/service/api/reports-api'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import BkButton from '@/components/bk-button/bk-button'

export default function DefaultReport(props:{
  checkItems: any[],
  examId: string,
  itemType: REPORT_ITEM_TYPE_CN
}) {
  const {checkItems,examId,itemType} = props
  const [busy,setBusy] = React.useState(false)
  const setting = custom.reportsPage
  let urls = []
  checkItems.forEach(item => {
    if(item.url){
      urls.push(item.url)
    }
  })
  const CardItem = (params) => {
    if(params.text){
      return(
        <View className='card-item'>
          <View style='font-weight: 500'>{params.title}:</View>
          <View>{params.text}</View>
        </View>
      )
    }else{
      return null
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
  const showImages = (_urls) => {
    Taro.previewImage({
      current: _urls[0],
      urls: _urls
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
    <View className='reports-detail' style='padding: 40rpx;'>
      {
        setting.showImageDetail && 
        <View className='reports-detail-content'>
          <Image src={checkItems[0]? checkItems[0].url : ''} />
          <View className='reports-detail-footer'>
            {/* {
              checkItems[0] && checkItems[0].url &&
              <BkButton title='查看图片' onClick={onClick.bind(null,checkItems[0]? checkItems[0].url : '')} />
            } */}
            {
              urls.length > 0 && 
              <BkButton title='查看图片' onClick={showImages.bind(null,urls)} />
            }
          </View>
        </View>
      }
      {
        !setting.showImageDetail && checkItems.map((item,index) => 
          <BkPanel key={index}>
            <CardItem title='编号' text={item.No} />
            <CardItem title='名称' text={item.examItemName} />
            <CardItem title='结果' text={item.content} />
            <CardItem title='描述' text={item.prompt} />
          </BkPanel>
        )
      }
      {
        // 特殊处理 广三黄埔院区返回的是base64格式的报告，后端处理成url资源
        custom.hospName === 'gy3yhp' &&
        <AtButton type='primary' loading={busy} circle onClick={handleFetchPdfUrl}>查看pdf</AtButton>
      }
    </View>
  )
}