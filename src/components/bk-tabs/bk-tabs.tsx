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
export default function BkTabs(props: {
  current?: number,
  tabs: any[],
  onTabChange?: Function,
  value?: string,
  style?: string,
  block?: boolean
}) {
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
  if(props.block){
    return (
      <View className='bk-tabs bk-tabs-block' style={props.style ? props.style : ''}>
        {
          list.map((item,index) => 
            <View key={index} className={`'block-tab' ${current === index ? 'block-active' : 'block-unactive'}`} onClick={onClick.bind(null,index,item.value)}>
              <View >{item.title}</View>
            </View>
          )
        }
      </View>
    )
  }else{
    return (
      <View className='bk-tabs' style={props.style ? props.style : ''}>
        {
          list.map((item,index) => 
            <View key={index} className='bk-tab' onClick={onClick.bind(null,index,item.value)}>
              <View  className={`'bk-tab-title' ${current === index ? 'active' : 'inactive'}`}>{item.title}</View>
              <View className={current === index ? 'bk-tab-line' : ''}></View>
            </View>
          )
        }
      </View>
    )
  }
  
}