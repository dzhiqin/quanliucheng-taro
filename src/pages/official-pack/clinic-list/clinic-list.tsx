import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import { useEffect,useState } from 'react'
import { fetchClinicList, TaroNavigateService } from '@/service/api'
import { modalService } from '@/service/toast-service'
import BkLoading from '@/components/bk-loading/bk-loading'
import { AtListItem } from 'taro-ui'
import VirtualList from '@tarojs/components/virtual-list'
import { custom } from '@/custom/index'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'

export default function ClinicList() {
  const [list,setList] = useState([])
  const [msg,setMsg] = useState('请稍后~')
  const sysInfo = Taro.getSystemInfoSync()
  const screenHeight = sysInfo.screenHeight
  const [busy,setBusy] = useState(false)
  const Row = React.memo(({id,index,style,data}) => {
    return (
      <AtListItem key={index} title={data[index].deptName} arrow='right' onClick={onClickItem.bind(null,data[index])} thumb='https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/intro_icon8.png' />
    )
  })
  Taro.useReady(() => {
    if(custom.feat.guangHuaMonitor.enable){
      reportCmPV_YL({title: '医院介绍'})
    }
  })
  useEffect(() => {
    setBusy(true)
    fetchClinicList().then(res => {
      if(res.resultCode === 0){
        // 目前默认只有一个院区，默认取第一个，如果需要多个院区切换，需要修改这里的代码
        const deptList = res.data[0].deptList
        setList(deptList)
        setBusy(false)
        if(!deptList || deptList.length === 0){
          setMsg('暂无数据')
        }
      }else{
        modalService({content: res.message})
        setBusy(false)
      }
    })
  },[])
 
  const onClickItem = (item) => {
    TaroNavigateService('official-pack','clinic-intro',`deptId=${item.deptId}`)
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
        <BkLoading loading={busy} msg={msg} />
      }
    </View>
  )
}