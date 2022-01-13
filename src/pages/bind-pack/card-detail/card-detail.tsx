import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View } from '@tarojs/components'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import {  useReady } from '@tarojs/taro'
import { useState } from 'react'
import { AtSwitch } from 'taro-ui'
import cardsHealper from '@/utils/cards-healper'
import './card-detail.less'
import { toastService } from '@/service/toast-service'

export default function CardDetail(props: any) {
  const [busy,setBusy] = useState(false)
  const [isDefault,setIsDefault] = useState(false)
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
    let currentCard = Taro.getStorageSync('card')
    if(!currentCard){
      currentCard = cardsHealper.getDefault()
    }
    setIsDefault(currentCard.isDefault)
    setCard(currentCard)
    
  })
  const handleChange = (e) => {
    setIsDefault(true)
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
      toastService({title: '解绑成功', onClose: () =>{Taro.navigateBack()} })
      setBusy(false)
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