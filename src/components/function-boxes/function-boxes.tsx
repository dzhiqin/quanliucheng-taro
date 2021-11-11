import { useContext } from 'react'
import * as React from 'react'
import { MyContext } from '@/utils/my-context'
import { View } from '@tarojs/components'
import BoxItem from './box-item'

export default function FunctionBoxes(props) {
   const {functionBox} = useContext(MyContext)
   return (
     <View className='function-box-container' style='display: flex; padding: 40rpx 0; border-bottom: 12rpx solid #F6F6F6;'>
       {
         functionBox.list.map((item,index) => <BoxItem key={index} item={item}>list</BoxItem>)
       }
     </View>
   )
}