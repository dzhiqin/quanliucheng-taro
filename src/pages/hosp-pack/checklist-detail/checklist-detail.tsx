import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { fetchInHospBillDetail } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import { useState } from 'react'
import BkNone from '@/components/bk-none/bk-none'
import BkPanel from '@/components/bk-panel/bk-panel'
import './checklist-detail.less'

export default function ChecklistDetail() {
  const router = useRouter()
  const params = router.params
  const {registerId, billDate} = params
  const [list,setList] = useState([])
  Taro.useDidShow(() => {
    loadingService(true)
    fetchInHospBillDetail({registerId,billDate})
    .then(res => {
      // console.log(res);
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
        <View style='padding: 40rpx'>
          {
            list.map((item,index) => 
              <BkPanel key={index} style='margin-bottom: 30rpx'>
                <View className='checklist-detail-item'>
                  <text>编码：</text>
                  <text className='checklist-detail-item-value'>{item.itemCode}</text>
                </View>
                <View className='checklist-detail-item'>
                  <text>名称：</text>
                  <text className='checklist-detail-item-value'>{item.itemName}</text>
                </View>
                <View className='checklist-detail-item'>
                  <text>规格：</text>
                  <text className='checklist-detail-item-value'>{item.itemSpec}</text>
                </View>
                <View className='checklist-detail-item flex-between'>
                  <View style='flex: 1'>
                    <text>数量：</text>
                    <text className='checklist-detail-item-value'>{item.amount}</text>
                  </View>
                  <View style='flex: 1'>
                    <text>单位：</text>
                    <text className='checklist-detail-item-value'>{item.itemUnit}</text>
                  </View>
                </View>
                <View className='checklist-detail-item flex-between'>
                  <View style='flex: 1'>
                    <text>单价：</text>
                    <text className='checklist-detail-item-value'>{item.itemPrice}</text>
                  </View>
                  <View style='flex: 1'>
                    <text>金额：</text>
                    <text className='checklist-detail-item-value'>{item.costs}</text>
                  </View>
                </View>
              </BkPanel>
            )
          }
        </View>
        :
        <BkNone msg='暂无明细' />
      }
    </View>
  )
}