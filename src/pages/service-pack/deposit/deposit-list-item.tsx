import * as React from 'react'
import {View, Image} from '@tarojs/components'
import BkPanel from '@/components/bk-panel/bk-panel'
import dateImg from '@/images/icons/calendar.png'
import priceImg from '@/images/icons/money_circle.png'

export default function DepositListItem(props: {
  item: {
    billDate: string,
    id: string,
    orderNo: string,
    prePayMoney: string
  },
  onClickItem?: Function
}){
  const { onClickItem } = props
  const onClick = () => {
    onClickItem(props.item)
  }
  return (
    <BkPanel style='margin-bottom: 30rpx' onClick={onClick}>
      <View className='flex-between deposit-item'>
        <View className='flex'>
          <Image className='deposit-item-img' src={dateImg}></Image>
          <text>日期：</text>
        </View>
        <text>{props.item.billDate}</text>
      </View>
      <View className='flex-between deposit-item'>
        <View className='flex'>
          <Image className='deposit-item-img' src={priceImg}></Image>
          <text>充值金额：</text>
        </View>
        <text>{props.item.prePayMoney}元</text>
      </View>
    </BkPanel>
  )
}