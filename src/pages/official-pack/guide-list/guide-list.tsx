import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useEffect,useState } from 'react'
import { fetchGuideList } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import BkNone from '@/components/bk-none/bk-none'
import {AtList,AtListItem} from 'taro-ui'

export default function GuideList() {
  const [list,setList] = useState([])
  useEffect(() => {
    loadingService(true)
    fetchGuideList().then(res => {
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        toastService({title: '' + res.message})
      }
    }).finally(() =>{
      loadingService(false)
    })
  }, [])
  const onClickItem = (item) => {
    Taro.setStorageSync('content',JSON.stringify(item.content))
    Taro.navigateTo({url: '/pages/official-pack/guide-detail/guide-detail'})
  }
  return (
    <View className='guide-list'>
      {
        list.length > 0
        ?
        <AtList>
          {
            list.map((item,index) => 
              <AtListItem key={index} arrow='right' extraText='详细信息' title={item.title} onClick={onClickItem.bind(null,item)} />
            )
          }
        </AtList>
        :
        <BkNone msg='暂无相关指引' />
      }
    </View>
  )
}