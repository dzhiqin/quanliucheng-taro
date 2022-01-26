import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { fetchInHospBillDetail, fetchInHospBillCategories } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import { useState } from 'react'
import BkNone from '@/components/bk-none/bk-none'
import BkPanel from '@/components/bk-panel/bk-panel'
import VirtualList from '@tarojs/components/virtual-list'
import './checklist-detail.less'
import BkTabs from '@/components/bk-tabs/bk-tabs'

export default function ChecklistDetail() {
  const router = useRouter()
  const params = router.params
  const {registerId, billDate} = params
  const [list,setList] = useState([])
  const sysInfo = Taro.getSystemInfoSync()
  const screenHeight = sysInfo.screenHeight
  const [tabList,setTabList] = useState([])
  const [currentTab,setCurrentTab] = useState(0)
  const [categories,setCategories] = useState([])
  const Row = React.memo(({id,index,style,data}) => {
    return (
      <BkPanel style='margin: 20rpx'>
        <View className='checklist-detail-item'>
          <text>编码：</text>
          <text className='checklist-detail-item-value'>{data[index].itemCode}</text>
        </View>
        <View className='checklist-detail-item'>
          <text>名称：</text>
          <text className='checklist-detail-item-value'>{data[index].itemName}</text>
        </View>
        <View className='checklist-detail-item'>
          <text>规格：</text>
          <text className='checklist-detail-item-value'>{data[index].itemSpec}</text>
        </View>
        <View className='checklist-detail-item flex-between'>
          <View style='flex: 1'>
            <text>数量：</text>
            <text className='checklist-detail-item-value'>{data[index].amount}</text>
          </View>
          <View style='flex: 1'>
            <text>单位：</text>
            <text className='checklist-detail-item-value'>{data[index].itemUnit}</text>
          </View>
        </View>
        <View className='checklist-detail-item flex-between'>
          <View style='flex: 1'>
            <text>单价：</text>
            <text className='checklist-detail-item-value'>{data[index].itemPrice} 元</text>
          </View>
          <View style='flex: 1'>
            <text>金额：</text>
            <text className='checklist-detail-item-value'>{data[index].costs} 元</text>
          </View>
        </View>
      </BkPanel>
    )
  })
  const getBillCategories = () => {
    fetchInHospBillCategories({registerId,billDate}).then(res => {
      if(res.resultCode === 0 && res.data.categoryBillList.length > 0){
        const _categories = res.data.categoryBillList
        setCategories(res.data.categoryBillList)
        let arr = [{title: '全部'}]
        _categories.forEach(i => {
          arr.push({title: i.categoryName})
        })
        setTabList(arr)
      }
    })
  }
  Taro.useReady(() => {
    getBillCategories()
  })
  Taro.useDidShow(() => {
    getInHospBillDetail()
  })
  const getInHospBillDetail = (categoryId = '') => {
    loadingService(true)
    fetchInHospBillDetail({registerId,billDate,categoryId})
    .then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        toastService({title: res.message})
      }
    })
    .catch(err => {
      toastService({title: '获取数据失败'+err})
    })
  }
  const onTabChange = (e) => {
    setCurrentTab(e)
    const index = e - 1
    const categoryId = index >= 0 ? categories[index].categoryId : ''
    getInHospBillDetail(categoryId)
  }
  return(
    <View className='checklist-detail'>
      <BkTabs tabs={tabList} current={currentTab} block onTabChange={onTabChange.bind(this)} />
      {
        list.length > 0
        ?
        <VirtualList
          height={screenHeight}
          width='100%' 
          itemData={list}
          itemCount={list.length}  
          itemSize={200}
        >
          {Row} 
        </VirtualList>
        :
        <BkNone msg='暂无明细' />
      }

      {/* {
        list.length > 0
        ?
        <View style='padding: 40rpx'>
          {
            list.map((item,index) => 
              <ChcekListItem item={item} key={index}></ChcekListItem>
            )
          }
        </View>
        :
        <BkNone msg='暂无明细' />
      } */}
    </View>
  )
}