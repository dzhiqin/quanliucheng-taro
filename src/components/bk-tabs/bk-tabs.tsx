import * as React from 'react'
import { View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import './bk-tabs.less'
/**
 * @param current: number
 * @param tabs: [{title: string,value?: any}]
 * @param onTabchange
 * @returns index,value
 */
export default function BkTabs(props: any) {
  const [current,setCurrent] = useState(props.current)
  const [list,setList] = useState(props.tabs || [{title:'门诊'},{title: '其他'}])
  const { onTabChange } = props
  const onClick = (index: number,value?: any) => {
    setCurrent(index)
    onTabChange(index,value)
  }
  useEffect(() => {
    setCurrent(0)
  }, [])
  useEffect(() => {
    setList(props.tabs)
  }, [props])
  return (
    <View className='bk-tabs'>
      {
        list.map((item,index) => <View key={index} className='bk-tab' onClick={onClick.bind(null,index,item.value)}>
          <View  className={`'bk-tab-title' ${current === index ? 'active' : 'inactive'}`}>{item.title}</View>
          <View className={current === index ? 'bk-tab-line' : ''}></View>
        </View>)
      }
    </View>
  )
}