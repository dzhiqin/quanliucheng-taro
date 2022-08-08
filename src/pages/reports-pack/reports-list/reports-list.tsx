import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useDidShow, useRouter } from '@tarojs/taro'
import { fetchReportsList } from '@/service/api/reports-api'
import { useState } from 'react'
import { REPORT_TYPE_EN, REPORT_ITEM_TYPE_CN } from '@/enums/index'
import HealthCards from '@/components/health-cards/health-cards'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import BkNone from '@/components/bk-none/bk-none'
import { humanDateAndTime } from '@/utils/format'
import { loadingService, toastService } from '@/service/toast-service'
import { CardsHealper } from '@/utils/cards-healper'
import { custom } from '@/custom/index'
import './reports-list.less'

export default function ReportList() {
  const router = useRouter()
  const params = router.params
  const reportType = params.reportType as REPORT_TYPE_EN
  const [itemType,setItemType] = useState(REPORT_ITEM_TYPE_CN.化验)
  const [list,setList] = useState([])
  const clinicTabs = custom.reportsPage.reportItemTabs
  const hospitalizationTabs = custom.reportsPage.hospitalizationTabs
  const onTabChange = (index,value) => {
    if(value !== itemType){
      setItemType(value)
      getList(value)
    }
  }
  const getList = (_itemType: REPORT_ITEM_TYPE_CN) => {
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
  // Taro.useReady(() => {
  //   const card = CardsHealper.getDefault()
  //   if(!card){
  //     toastService({title: '请先绑卡'})
  //     return
  //   }
  //   getList(itemType)
  // })
  useDidShow(() => {
    const card = CardsHealper.getDefault()
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
      <HealthCards />
      <BkTabs tabs={reportType === REPORT_TYPE_EN.clinic? clinicTabs : hospitalizationTabs} onTabChange={onTabChange} />
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
                    <View className='reports-list-item-text'>{item.id}</View>
                  </View>
                  <View className='flex'>
                    <View className='reports-list-item-name'>{itemType === REPORT_ITEM_TYPE_CN.化验 ? '检验名称' : '检查名称'}</View>
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