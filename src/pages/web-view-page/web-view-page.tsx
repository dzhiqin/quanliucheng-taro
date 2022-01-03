import * as React from 'react'
import { View, WebView } from '@tarojs/components'
import * as Taro from '@tarojs/taro'

export default function WebViewPage(){
  const webViewSrc: string= Taro.getStorageSync('webViewSrc')
  return(
    <View className='web-view'>
      <WebView src={webViewSrc}></WebView>
    </View>
  )
  
}