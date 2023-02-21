import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { fetchAllInHospBillDetail, fetchInHospBillCategories, fetchInHospBillDetailByCategory } from '@/service/api'
import { loadingService, modalService } from '@/service/toast-service'
import { useState } from 'react'
import VirtualList from '@tarojs/components/virtual-list'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import BkLoading from '@/components/bk-loading/bk-loading'
import './checklist-detail.less'

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
  const [busy,setBusy] = useState(false)
  const card = Taro.getStorageSync('hospCard')
  const Row = React.memo(({id,index,style,data}) => {
    return (
      <BkPanel >
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
          <text className='checklist-detail-item-value'>{data[index].itemSpec || '-'}</text>
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
    fetchInHospBillCategories({registerId,billDate,inCardNo:card.cardNo}).then(res => {      
      if(res.resultCode === 0 && res.data.length > 0){
        const _categories = res.data
        setCategories(res.data)
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
    getAllInHospBills()
  })
  const getAllInHospBills = () => {
    setBusy(true)
    fetchAllInHospBillDetail({registerId,billDate,inCardNo: card.cardNo})
    .then(res => {
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
      setBusy(false)
    })
    .catch(err => {
      modalService({title: '获取数据失败',content: JSON.stringify(err)})
    })
  }
  const getInHospBillsByCategory = (_categoryId) => {
    loadingService(true)
    fetchInHospBillDetailByCategory({registerId,billDate,inCardNo: card.cardNo, categoryId:_categoryId}).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
    }).catch(err => {
      loadingService(false)
      modalService({content: JSON.stringify(err)})
    })
  }
  const onTabChange = (e) => {
    setCurrentTab(e)
    const index = e - 1
    const categoryId = index >= 0 ? categories[index].categoryId : ''
    if(categoryId){
      getInHospBillsByCategory(categoryId)
    }else{
      setList([])
      getAllInHospBills()
    }
  }
  return(
    <View className='checklist-detail'>
      <BkTabs tabs={tabList} current={currentTab} block onTabChange={onTabChange.bind(this)} />
      <View>{billDate}住院费用清单</View>
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
        <BkLoading loading={busy} msg='暂无明细' />
      }
    </View>
  )
}