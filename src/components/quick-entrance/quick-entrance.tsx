import { View,Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import BkTabs from '../bk-tabs/bk-tabs'
import './quick-entrance.less'
import { TaroNavToMiniProgram, TaroNavigateService } from '@/service/api'
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
    }else if(item.event === 'jump'){
      TaroNavToMiniProgram({appId: item.appId, path: item.path, envVersion: item.envVersion}).then(() => {
        console.log('跳转小程序成功');
      })
    }else if(item.event === 'health'){
      // 金沙洲跳转体检小程序
      my.navigateTo({
        url: "plugin://heHealth/pages/home/index?stationId=HL01826"
      });
    }else if(item.event === 'location'){
      Taro.openLocation({
        latitude: custom.latitude,
        longitude: custom.longitude,
        name: custom.address
      })
    }else if(item.event === 'subscribe'){
      // 调试用
      my.requestSubscribeMessage({
        entityIds: item.tempId.split(','),
        success: res => {
          console.log(res);
          
        },
        fail: err => {
          console.log(err);
          
        }
      })
    }else if(item.event === 'getLocation'){
      // 调试用
      my.getSystemInfo({
        success: (res) => {
            console.log('getSystemInfo',res);
        },
        fail: (err) => {
            console.log(err);
        }
      })
      my.getLocation({
        type: 1, // 获取经纬度和省市区县数据
        success: (res) => {
          console.log(res);
          modalService({content: JSON.stringify(res)})
        },
        fail: (res) => {
          my.alert({ title: '定位失败', content: JSON.stringify(res) });
          my.showAuthGuide({
            authType: "LBS"
          });
        },
        complete: () => {},
      });
    }else if(item.event === 'auth'){
      // 调试用
      if(item.scope){
        my.getAuthCode({
          scopes: item.scope.split(','),
          success: res => {
            const {authCode} = res
            modalService({content: authCode,confirmText: 'copy',success: () => {
              my.setClipboard({text: authCode})
            }})
            // handleAuthCode({code: authCode,authType: ''}).then(authRes => {
            //   console.log('authRes',authRes);
              
            // })
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
      
    }else if(item.event==='redirect'){
      my.ap.openURL({
        url: 'https://render.alipay.com/p/s/medical-card-online/www/online-pay.html?returnUrl=alipays%3A%2F%2Fplatformapi%2Fstartapp%3FappId%3D2021003171691188%26page%3Dpages%2Fpayment-pack%2Fpayment-list%2Fpayment-list&openapiAppId=2021003171691188&reqBizNo=1191312',
        success: (res) => {
          console.log('openURL success', res)
        },
        fail: (err) => {
          console.log('openURL success', err)
        }
      });
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