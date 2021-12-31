import * as React from 'react'
import { View } from '@tarojs/components'
import './bk-price.less'

export default function BkPrice(props:{
  large?:boolean,
  value: string | number, 
  symbol?: boolean,
  style?: string
}){
  return(
    <View className='bk-price' style={props.style ? props.style : ''}>
      {
        props.symbol &&
        <text className='bk-price-symbol'>￥</text> 
      }
      <text className={`bk-price-value ${props.large ? 'bk-price-large' : 'bk-price-normal'}`}>{props.value}</text>
      {
        !props.symbol &&
        <text>元</text>
      }
    </View>
  )
}