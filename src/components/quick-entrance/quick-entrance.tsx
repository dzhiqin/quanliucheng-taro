import { View,Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import BkTabs from '../bk-tabs/bk-tabs'
import './quick-entrance.less'
import { TaroNavToMiniProgram,handleAuthCode, TaroNavigateService } from '@/service/api'
import { modalService } from '@/service/toast-service'
import { custom } from '@/custom/index'

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
      TaroNavigateService(item.url)
    }
    if(item.event === 'jump'){
      TaroNavToMiniProgram({appId: item.appId, path: item.path}).then(() => {
        console.log('跳转小程序成功');
      })
    }
    if(item.event === 'subscribe'){
      my.requestSubscribeMessage({
        entityIds: item.tempId.split(','),
        success: res => {
          console.log(res);
          
        },
        fail: err => {
          console.log(err);
          
        }
      })
    }
    if(item.event === 'click'){
      // const {orgChnlCrtfCodg, orgCodg, bizType, orgAppId, cityCode, channel} = custom.yibaoParams
      // const path = `auth/pages/bindcard/auth/index?openType=getAuthCode&cityCode=${cityCode}&channel=${channel}&orgChnlCrtfCodg=${orgChnlCrtfCodg}&orgCodg=${orgCodg}&bizType=${bizType}&orgAppId=${orgAppId}`
      const path = 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=440108&channel=AAGE84GHsRIzjSdxPaPQtNqU&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvShtXBpXvc4WkWexOKgovx&orgCodg=H44010300017&orgAppId=1GPA6UN3P0AU3F60C80A0000B246C727'
      TaroNavToMiniProgram({appId: 'wxe183cd55df4b4369', path, envVersion: 'trial'})
    }
    if(item.event === 'auth'){
      if(item.scope){
        my.getAuthCode({
          scopes: item.scope.split(','),
          success: res => {
            const {authCode} = res
            // modalService({content: authCode,confirmText: 'copy',success: () => {
            //   my.setClipboard({text: authCode})
            // }})
            handleAuthCode({code: authCode,authType: ''}).then(authRes => {
              console.log('authRes',authRes);
              
            })
          }
        })
      }else{
        my.getAuthCode({
          success: res => {
            const {authCode} = res
            modalService({content: authCode,confirmText: 'copy',success: () => {
              my.setClipboard({text: authCode})
            }})
            
          }
        })
      }
      
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