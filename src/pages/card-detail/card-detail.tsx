import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import { useRouter, useReady } from '@tarojs/taro'
import { useState } from 'react'
import { AtSwitch } from 'taro-ui'
import "taro-ui/dist/style/components/switch.scss"
import cardsHealper from '@/utils/cards-healper'
import { deleteCard } from '@/service/api'
import './card-detail.less'

export default function CardDetail(props: any) {
  const router = useRouter()
  const [busy,setBusy] = useState(false)
  const [isDefault,setDefault] = useState(false)
  const [card,setCard] = useState({
    name: '',
    id: '',
    birthdate: '',
    cardNo: '',
    cellphone: '',
    idenNo: '',
    isDefault: false,
    qrCode: '',
    qrCodeText: '',
    type: ''
  })
  useReady(() => {
    const obj = JSON.parse(router.params.card)
    console.log('useReady',obj)
    setDefault(obj.isDefault)
    setCard(obj)
    
  })
  const handleChange = (e) => {
    setDefault(true)
    if(e){
      cardsHealper.setDefault(card.id)
      Taro.showToast({
        title: '已设置为默认卡',
        icon: 'none'
      })
    }
  }
  const handleUnBind = () => {
    setBusy(true)
    cardsHealper.delete(Number(card.id)).then(res => {
      console.log('delte success',res);
      setBusy(false)
      Taro.navigateBack()
    })
  }
  
  return(
    <View className='card-detail'>
      <BkPanel>
        <View className='card-item'>
          <View>姓名</View>
          <View>{card.name}</View>
        </View>
        <View className='card-item'>
          <View>出生日期</View>
          <View>{card.birthdate}</View>
        </View>
        <View className='card-item'>
          <View>证件号码</View>
          <View>{card.idenNo}</View>
        </View>
        <View className='card-item'>
          <View>手机号</View>
          <View>{card.cellphone}</View>
        </View>
        {
          !isDefault &&
          <View className='card-item'>
            <View>设为默认就诊人</View>
            <View>
              <AtSwitch border={false} checked={card.isDefault} onChange={handleChange} />
            </View>
          </View>
        }
        
      </BkPanel>
      <View className='btns'>
        <BkButton title='解除绑定' onClick={handleUnBind} loading={busy} />
      </View>
    </View>
  )
}