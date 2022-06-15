import * as React from 'react'
import { View, Image } from '@tarojs/components'
import nonePng from '@/images/none.png'
/**
 * 
 * @param size: 'small' || ''
 * @param msg: string 
 * @returns 
 */
export default function BkNone(props:{
  size?:'small' | '', 
  msg?: string,
  loading?: boolean
}){
  const [_loading,setLoading] = React.useState(true)
  React.useEffect(() => {
    setLoading(props.loading)
  },[props.loading])
  const normalImage = {
    width: '500rpx',
    height: '400rpx'
  }
  const smallImage = {
    width: '300rpx',
    height: '200rpx'
  }
  return(
    <View style='width: 100%;height: 100%; display:flex; flex-direction: column; justify-content: center; align-items: center'>
      <Image src={nonePng} style={props.size === "small" ? smallImage : normalImage} />
      <View style='font-size: 26rpx;color: #999; margin-top: 20rpx'>{_loading ? '请稍后~' : (props.msg || '暂无内容')}</View>
    </View>
  )
}