import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useEffect,useState } from 'react'
import { fetchReportsDetail } from '@/service/api/reports-api'
import { reportItemType_CN,reportType_EN } from '@/enums/*'
import custom from '@/custom/index'
import './reports-detail.less'
import BkButton from '@/components/bk-button/bk-button'

export default function ReportsDetail() {
  const router = useRouter()
  const [checkItems,setCheckItems] = useState([])
  const reportsPage = custom.reportsPage
  const params = router.params as {examId: string,examDate: string, itemType: reportItemType_CN, reportType: reportType_EN}
  const {examId, examDate, itemType, reportType} = params
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
  return(
    <View className='reports-detail'>
      {
        reportsPage.urlDetail 
        ? 
        <View className='reports-detail-content'>

          <Image src={checkItems[0]? checkItems[0].url : ''} />
          <View className='reports-detail-footer'>
            {
              checkItems[0] && checkItems[0].url &&
              <BkButton title='查看图片' onClick={onClick.bind(null,checkItems[0]? checkItems[0].url : '')} />
            }
          </View>
        </View>
        :
        checkItems.map((item,index) => 
          <View key={index}>
            <View>编号:</View>
            <View>{item.itemNo}</View>
          </View>
        )
      }
    </View>
  )
}