import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { fetchInHospBillDetail } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import { useState } from 'react'
import BkNone from '@/components/bk-none/bk-none'
import BkPanel from '@/components/bk-panel/bk-panel'
import VirtualList from '@tarojs/components/virtual-list'
import './checklist-detail.less'

export default function ChecklistDetail() {
  const router = useRouter()
  const params = router.params
  const {registerId, billDate} = params
  const [list,setList] = useState([])
  const sysInfo = Taro.getSystemInfoSync()
  const screenHeight = sysInfo.screenHeight
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
            <text className='checklist-detail-item-value'>{data[index].itemPrice}</text>
          </View>
          <View style='flex: 1'>
            <text>金额：</text>
            <text className='checklist-detail-item-value'>{data[index].costs}</text>
          </View>
        </View>
      </BkPanel>
    )
  })
  Taro.useDidShow(() => {
    loadingService(true)
    fetchInHospBillDetail({registerId,billDate})
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
  })
  return(
    <View className='checklist-detail'>
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