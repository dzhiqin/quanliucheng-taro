import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useEffect,useState } from 'react'
import { fetchGuideList, TaroNavigateService } from '@/service/api'
import { loadingService, modalService } from '@/service/toast-service'
import BkLoading from '@/components/bk-loading/bk-loading'
import {AtList,AtListItem} from 'taro-ui'
import { custom } from '@/custom/index'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'

export default function GuideList() {
  const [list,setList] = useState([])
  useEffect(() => {
    loadingService(true)
    fetchGuideList().then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
    })
  }, [])
  Taro.useReady(() => {
    if(custom.feat.guangHuaMonitor.enable){
      reportCmPV_YL({title: '就医指南'})
    }
  })
  const onClickItem = (item) => {
    Taro.setStorageSync('content',JSON.stringify(item.content))
    TaroNavigateService('official-pack','guide-detail')
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
        <BkLoading msg='暂无相关指引' />
      }
    </View>
  )
}