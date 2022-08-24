import * as React from 'react'
import { ScrollView, View } from '@tarojs/components'
import { useState, useEffect } from 'react'
import './bk-vertical-tab.less'

export default function BkVerticalTab(props:{
  name: string,
  key?: string,
  onChange?: Function,
  style?: string,
  list: any[],
  current?: number 
}){
  const name = props.name
  const key = props.key
  const [current,setCurrent] = useState(props.current)
  const onChange = props.onChange
  const onClick = (index,item) => {
    // setCurrent(index)
    if(typeof onChange === 'function'){
      onChange(item,index)
    }
  }
  useEffect(() => {
    setCurrent(props.current)
  }, [props,current])
  return(
    <ScrollView id='bk-vertical-tab' className={`'bk-vertical-tab'`} style={props.style ? props.style : ''} scrollY >
      {
        props.list && props.list.map((item,index) => 
          <View className={`tab-item ${current == index ? 'tab-item-active' : ''}`} onClick={onClick.bind(null,index,item)} key={key ? item[key]: index}>{item[name]}</View>
        )
      }
    </ScrollView>
  )
}