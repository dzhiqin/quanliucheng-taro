import * as React from 'react'
import { View } from '@tarojs/components'
import BkPanel from '@/components/bk-panel/bk-panel'

export default function ChcekListItem(props:{
  item: {
    itemCode: string,
    itemName: string,
    itemSpec: string,
    amount: string,
    itemUnit: string,
    itemPrice: string,
    costs: string
  }
}) {
  return (
    <BkPanel style='margin-bottom: 30rpx'>
      <View className='checklist-detail-item'>
        <text>编码：</text>
        <text className='checklist-detail-item-value'>{props.item.itemCode}</text>
      </View>
      <View className='checklist-detail-item'>
        <text>名称：</text>
        <text className='checklist-detail-item-value'>{props.item.itemName}</text>
      </View>
      <View className='checklist-detail-item'>
        <text>规格：</text>
        <text className='checklist-detail-item-value'>{props.item.itemSpec}</text>
      </View>
      <View className='checklist-detail-item flex-between'>
        <View style='flex: 1'>
          <text>数量：</text>
          <text className='checklist-detail-item-value'>{props.item.amount}</text>
        </View>
        <View style='flex: 1'>
          <text>单位：</text>
          <text className='checklist-detail-item-value'>{props.item.itemUnit}</text>
        </View>
      </View>
      <View className='checklist-detail-item flex-between'>
        <View style='flex: 1'>
          <text>单价：</text>
          <text className='checklist-detail-item-value'>{props.item.itemPrice}</text>
        </View>
        <View style='flex: 1'>
          <text>金额：</text>
          <text className='checklist-detail-item-value'>{props.item.costs}</text>
        </View>
      </View>
    </BkPanel>
  )
}