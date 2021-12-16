import * as React from 'react'
import { View } from '@tarojs/components'
import { useRouter } from '@tarojs/taro';

export default function SearchResult() {
  const router = useRouter()
  console.log(router);
  return(
    <View>search result</View>
  )
}