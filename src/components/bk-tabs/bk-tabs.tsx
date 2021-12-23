import * as React from 'react'
import { View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import './bk-tabs.less'

export default function BkTabs(props: any) {
  const [current,setCurrent] = useState(props.current || 0)
  const [list,setList] = useState(props.tabs || [{title:'门诊'},{title: '其他'}])
  const { onTabChange } = props
  
  const onClick = (index: number) => {
    setCurrent(index)
    onTabChange(index)
  }
 
  useEffect(() => {
    setCurrent(props.current || 0)
    setList(props.tabs)

  }, [props])
  return (
    <View className='bk-tabs'>
      {
        list.map((item,index) => <View key={index} className='bk-tab' onClick={onClick.bind(null,index)}>
          <View  className={`'bk-tab-title' ${current === index ? 'active' : 'inactive'}`}>{item.title}</View>
          <View className={current === index ? 'bk-tab-line' : ''}></View>
        </View>)
      }
    </View>
  )
}