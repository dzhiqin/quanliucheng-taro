import { View,Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import * as React from 'react'
import BkTabs from '../bk-tabs/bk-tabs'
import './quick-entrance.less'

export default function QuickEntrance(props: any) {
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
  const onClickItem = (item: string) => {
    console.log('click',item)
  }
  return(
    <View className='quick-entrance'>
      <BkTabs onTabChange={onTabChange} tabs={tabs}></BkTabs>
      <View className='tab-content'>
        {entrances.map((item,index)=> <View className='tab-item' key={index} onClick={onClickItem.bind(null,item.event)}>
          <Image src={item.icon} className='tab-item-icon'></Image>
          <View className='tab-item-title'>{item.name}</View>
        </View>)}
      </View>
      {/* <AtTabs current={currentTab} tabList={tabs} onClick={onTabChange}></AtTabs> */}
      {/* <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick.bind(this)}>
        <AtTabsPane current={this.state.current} index={0} >
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >标签页一的内容</View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={2}>
          <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页三的内容</View>
        </AtTabsPane>
      </AtTabs> */}
    </View>
  )
}