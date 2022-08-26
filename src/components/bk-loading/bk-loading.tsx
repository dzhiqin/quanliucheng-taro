import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { getImageSrc } from '@/utils/image-src'
import './bk-loading.less'

export default function BkLoading(props:{
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
    <View className='loading'>
      {
        _loading ? 
        <View className='loader'></View>
        :
        <View className='loading-content'>
          <Image src={getImageSrc('none.png')} style={props.size === "small" ? smallImage : normalImage} />
          <View className='loading-msg' >{props.msg || '暂无内容'}</View>
        </View>
      }
    </View>
  )
}