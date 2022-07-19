import * as React from 'react'
import { View } from '@tarojs/components'
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
    // Taro.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300
    // })
  }
  useEffect(() => {
    setCurrent(props.current)
  }, [props,current])
  // Taro.useReady(() => {
  //   const query = Taro.createSelectorQuery()
  //   query.select('#bk-vertical-tab').boundingClientRect()
  //   query.selectViewport().scrollOffset()
  //   query.exec(function(res){
  //     const top = res[0].top       // #the-id节点的上边界坐标
  //     // const bottom = res[1].scrollTop // 显示区域的竖直滚动位置
  //     console.log(`top=${top}`);
  //     console.log(res);
  //   })
  // })
  return(
    <View id='bk-vertical-tab' className={`'bk-vertical-tab'`} style={props.style ? props.style : ''}>
      {
        props.list && props.list.map((item,index) => 
          <View className={`tab-item ${current == index ? 'tab-item-active' : ''}`} onClick={onClick.bind(null,index,item)} key={key ? item[key]: index}>{item[name]}</View>
        )
      }
    </View>
  )
}