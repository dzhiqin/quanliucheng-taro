import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useEffect,useState } from 'react'
import { fetchClinicList } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import BkNone from '@/components/bk-none/bk-none'
import { AtListItem } from 'taro-ui'
import VirtualList from '@tarojs/components/virtual-list'

export default function ClinicList() {
  const [list,setList] = useState([])
  const [msg,setMsg] = useState('请稍后~')
  const sysInfo = Taro.getSystemInfoSync()
  const screenHeight = sysInfo.screenHeight
  const Row = React.memo(({id,index,style,data}) => {
    return (
      <AtListItem key={index} title={data[index].deptName} arrow='right' onClick={onClickItem.bind(null,data[index])} thumb='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/intro_icon8.png' />
    )
  })
  useEffect(() => {
    loadingService(true)
    fetchClinicList().then(res => {
      if(res.resultCode === 0){
        // 目前默认只有一个院区，取第一个，如果需要多个院区切换，再说
        const deptList = res.data[0].deptList
        setList(deptList)
        if(!deptList || deptList.length === 0){
          setMsg('暂无数据')
        }
      }else{
        toastService({title: '' + res.message})
      }
    })
  },[])
  useEffect(() => {
    loadingService(false)
  },[list])
  const onClickItem = (item) => {
    Taro.navigateTo({url: '/pages/official-pack/clinic-intro/clinic-intro?deptId=' + item.deptId})
  }
  return (
    <View className='clinic-list'>
      {
        list.length > 0
        ?
        <VirtualList
          height={screenHeight}
          width='100%'
          itemData={list}
          itemCount={list.length}
          itemSize={50}
        >
          {Row}
        </VirtualList>
        :
        <BkNone msg={msg} />
      }
    </View>
  )
}