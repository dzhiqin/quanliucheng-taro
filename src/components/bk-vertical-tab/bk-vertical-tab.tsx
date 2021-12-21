import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState } from 'react'
import './bk-vertical-tab.less'

export default function BkVerticalTab(props:any){
  const name = props.name
  const key = props.key
  const [current,setCurrent] = useState(0)
  const onChange = props.onChange
  const onClick = (index,item) => {
    setCurrent(index)
    if(typeof onChange === 'function'){
      onChange(item)
    }
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  }
  return(
    <View className='bk-vertical-tab' style={props.style ? props.style : ''}>
      {
        props.list && props.list.map((item,index) => 
          <View className={`tab-item ${current === index ? 'tab-item-active' : ''}`} onClick={onClick.bind(null,index,item)} key={key ? item[key]: index}>{item[name]}</View>
        )
      }
    </View>
  )
}