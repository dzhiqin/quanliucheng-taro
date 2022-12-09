import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { custom } from '@/custom/index'
import BkButton from '@/components/bk-button/bk-button'
import './reports-detail.less'
import { loadingService,toastService } from '@/service/toast-service'
import DefaultReport from './default-report'

export default function AltraSoundReport(props) {
  const {checkItems,examId,itemType} = props
  const [busy,setBusy] = React.useState(false)
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
  if(custom.hospName === 'gy3ylw'){ // 特殊处理
    return(
      <BkButton title='查看PDF' onClick={handleViewPdf} loading={busy} />
    )
  }else{
    return <DefaultReport checkItems={checkItems} examId={examId} itemType={itemType} />
  }
}