import { View,Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import BkTabs from '../bk-tabs/bk-tabs'
import './quick-entrance.less'
import { TaroNavToMiniProgram } from '@/service/api'

export default function QuickEntrance(props: {
  quickEntrance?:any
}) {
  const [quickEntrance] = useState(props.quickEntrance || {})
  const [tabs,setTabs] = useState([]) 
  const [entrances,setEntrances] = useState(quickEntrance.tabList[0].entrances || [])
  useEffect(() => {
    let array = []
    quickEntrance.tabList.forEach(item => {
      array.push({title:item.title})
    })
    setTabs(array)
  },[quickEntrance])
  const onTabChange = (e) => {
    setEntrances(quickEntrance.tabList[e].entrances)
  }
  const onClickItem = (item) => {
    if(item.event==='navigate'){
      Taro.navigateTo({url: item.url})
    }
    if(item.event === 'jump'){
      TaroNavToMiniProgram({appId: item.appId, path: item.path}).then(() => {
        console.log('跳转小程序成功');
      }).catch((err) => {
        console.error('跳转小程序失败')
      })
    }
  }
  
  return(
    <View className='quick-entrance'>
      <BkTabs onTabChange={onTabChange} tabs={tabs}></BkTabs>
      <View className='tab-content'>
        {entrances.map((item,index)=> 
          <View className='tab-item' key={index} onClick={onClickItem.bind(null,item)}>
            <Image src={item.icon} className='tab-item-icon'></Image>
            <View className='tab-item-title'>{item.name}</View>
          </View>)
        }
      </View>
    </View>
  )
}