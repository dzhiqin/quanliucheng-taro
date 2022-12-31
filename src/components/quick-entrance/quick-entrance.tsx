import { View,Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import BkTabs from '../bk-tabs/bk-tabs'
import './quick-entrance.less'
import { TaroNavToMiniProgram,handleAuthCode } from '@/service/api'
import { modalService } from '@/service/toast-service'
import GreenEnergyModal from '@/pages/register-pack/order-create/green-energy-modal'

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