import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useDidShow, useRouter } from '@tarojs/taro'
import { fetchReportsList } from '@/service/api/reports-api'
import { useState } from 'react'
import { reportType_EN, reportItemType_CN } from '@/enums/index'
import HealthCards from '@/components/health-cards/health-cards'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkNone from '@/components/bk-none/bk-none'
import './reports-list.less'
import { humanDateAndTime } from '@/utils/format'
import { loadingService, toastService } from '@/service/toast-service'
import cardsHealper from '@/utils/cards-healper'

export default function ReportList() {
  const router = useRouter()
  const params = router.params
  const reportType = params.reportType as reportType_EN
  const [itemType,setItemType] = useState(reportItemType_CN.化验)
  const [list,setList] = useState([])
  const clinicTabs = [
    {title: '化验', value: reportItemType_CN.化验},
    {title: '放射', value: reportItemType_CN.放射},
    {title: '超声', value: reportItemType_CN.超声},
    {title: '病理', value: reportItemType_CN.病理},
    {title: '内镜', value: reportItemType_CN.内镜},
  ]
  const hospitalizationTabs = [
    {title: '化验', value: reportItemType_CN.化验},
    {title: '放射', value: reportItemType_CN.放射},
    {title: '超声', value: reportItemType_CN.超声},
  ]
  const onTabChange = (index,value) => {
    if(value !== itemType){
      setItemType(value)
      getList(value)
    }
  }
  const getList = (_itemType: reportItemType_CN) => {
    loadingService(true)
    fetchReportsList({itemType: _itemType, reportType: reportType }).then(res => {
      if(res.resultCode === 0){
        loadingService(false)
        setList(res.data.checks)
      }else{
        toastService({title: res.message})
        setList([])
      }
    })
  }

  useDidShow(() => {
    const card = cardsHealper.getDefault()
    if(!card){
      toastService({title: '请先绑卡'})
      return
    }
    getList(itemType)
  })
  const onClickItem = (e) => {
    Taro.navigateTo({url: `/pages/reports-pack/reports-detail/reports-detail?examId=${e.id}&examDate=${e.date}&itemType=${itemType}&reportType=${reportType}`})
  }
  return(
    <View className='reports-list'>
      <HealthCards switch />
      <BkTabs tabs={reportType === reportType_EN.clinic? clinicTabs : hospitalizationTabs} onTabChange={onTabChange} />
      {
        list.length > 0
        ?
          <View className='reports-list-content' style='padding: 40rpx'>
            {
              list.map(item => 
                <BkPanel arrow onClick={onClickItem.bind(null,item)} key={item.id} style='margin-bottom: 40rpx'>
                  <View className='flex'>
                    <View className='reports-list-item-name'>开单日期</View>
                    <View className='reports-list-item-text'>{item.date.length > 10 ? humanDateAndTime(new Date(item.date)) : item.date}</View>
                  </View>
                  <View className='flex'>
                    <View className='reports-list-item-name'>开单编号</View>
                    <View className='reports-list-item-text'>{item.cardNo}</View>
                  </View>
                  <View className='flex'>
                    <View className='reports-list-item-name'>检查名称</View>
                    <View className='reports-list-item-text'>{item.name}</View>
                  </View>
                </BkPanel>
                )
            }
          </View>
        :
          <BkNone />
      }
    </View>
  )
}