import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useEffect,useState } from 'react'
import { fetchClinicList } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import BkNone from '@/components/bk-none/bk-none'
import { AtList, AtListItem } from 'taro-ui'

export default function ClinicList() {
  const [list,setList] = useState([])
  useEffect(() => {
    loadingService(true)
    fetchClinicList().then(res => {
      console.log(res);
      if(res.resultCode === 0){
        loadingService(false)
        // 目前默认只有一个院区，取第一个，如果需要多个院区切换，再说
        setList(res.data[0].deptList)
      }else{
        toastService({title: '' + res.message})
      }
    })
  },[])
  const onClickItem = (item) => {
    Taro.navigateTo({url: '/pages/official-pack/clinic-intro/clinic-intro?deptId=' + item.deptId})
  }
  return (
    <View className='clinic-list'>
      {
        list.length > 0
        ?
        <AtList>
          {
            list.map((item,index) => 
              <AtListItem key={index} title={item.deptName} arrow='right' onClick={onClickItem.bind(null,item)} thumb='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/intro_icon8.png' />
            )
          }
        </AtList>
        :
        <BkNone msg='暂未完善相关信息' />
      }
    </View>
  )
}