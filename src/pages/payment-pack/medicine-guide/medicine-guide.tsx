import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { fetchMedicineGuideList } from '@/service/api'
import { toastService } from '@/service/toast-service'
import './medicine-guide.less'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkLoading from '@/components/bk-loading/bk-loading'

export default function MedicineGuide() {
  const router = Taro.useRouter()
  const { orderId } = router.params
  const [list,setList] = React.useState([])
  const [busy,setBusy] = React.useState(false)

  Taro.useDidShow(() => {
    if(!orderId){
      toastService({title: '订单ID为空'})
      return
    }
    setBusy(true)
    fetchMedicineGuideList({orderId}).then(res => {
      // setList([{disWinAdd: 'zhongyao',visitNo: 123456789,disWin:"123"},{disWinAdd:"222222",visitNo: 123456789,disWin:'oiwkwq'}])
      setBusy(false)
      if(res.resultCode === 0){
        const _list = res.data
        setList(_list)
      }else{
        toastService({title: '获取数据失败'+res.message})
      }
    })
  })
  const ListItem = (props) => {
    const {item} = props
    return (
      <BkPanel style='margin-bottom: 40rpx; padding: 0 40rpx 40rpx;'>
        <View className='tag-primary'>{item.disWinAdd}</View>
        <View className='flex'>
          <View className='flat-title' style='margin-right: 10rpx'>发药流水号</View>
          <View>{item.visitNo}</View>
        </View>
        <View className='flex'>
          <View className='flat-title' style='margin-right: 10rpx'>发药窗口</View>
          <View>{item.disWin}</View>
        </View>
        {
          item.visitNoCode &&
          <Image src={`data:image/jpg;base64,${item.visitNoCode}`} className='barcode' />
        }
        
      </BkPanel>
    )
  }
  return(
    <View className='medicine-guide'>
      {
        list.length > 0 &&
        <View>
          {
            list.map((item,index) => <ListItem item={item} key={index}></ListItem>)
          }
        </View>
      }
      {
        list.length === 0 && 
        <BkLoading loading={busy} />
      }
    </View>
  )
}