import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image, Canvas } from '@tarojs/components'
import BkPanel from '@/components/bk-panel/bk-panel'
import BkButton from '@/components/bk-button/bk-button'
import {  useReady } from '@tarojs/taro'
import { useState } from 'react'
import { AtSwitch, AtTabs, AtTabsPane,AtAccordion } from 'taro-ui'
import { CardsHealper } from '@/utils/cards-healper'
import './card-detail.less'
import { modalService } from '@/service/toast-service'
import nrhcPng from '@/images/icons/nrhc.png'
import drawQrcode from '@/utils/weapp.qrcode.esm'

export default function CardDetail(props: any) {
  const [busy,setBusy] = useState(false)
  const [isDefault,setIsDefault] = useState(false)
  const [open,setOpen] = useState(false)
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
  const [currentTab,setCurrentTab] = useState(0)
  useReady(() => {
    let currentCard = Taro.getStorageSync('card')
    if(!currentCard){
      currentCard = CardsHealper.getDefault()
    }
    setIsDefault(currentCard.isDefault)
    setCard(currentCard)
    drawQrcode({
      width: 150,
      height: 150,
      canvasId: 'myQrcode',
      text: currentCard.cardNo,
      // 添加图片
      // image:{
      //   imageResource: '../../../images/icons/nrhc.png',
      //   dx: 60,
      //   dy: 60,
      //   dWidth: 30,
      //   dHeight: 30
      // }
    })
  })
  const handleChange = (e) => {
    setIsDefault(true)
    if(e){
      CardsHealper.setDefault(card.id)
      Taro.showToast({
        title: '已设置为默认卡',
        icon: 'none'
      })
    }
  }
  const handleUnBind = () => {
    setBusy(true)
    CardsHealper.remove(card).then(res => {
      Taro.showToast({
        title: '解绑成功',
        icon: 'success',
        complete: () => {
          setTimeout(() => {
            Taro.navigateBack()
          }, 2000)
        }
      })
      setBusy(false)
    }).catch(err => {
      modalService({title: '解绑失败',content: JSON.stringify(err)})
    })
  }
  const handleTabChange = (value) => {
    setCurrentTab(value)
  }
  return(
    <View className='card-detail'>
      <BkPanel style='margin-bottom: 40rpx; padding-top: 0;'>
        <AtTabs animated={false} current={currentTab} tabList={[{title: '诊疗卡'},{title: '电子健康卡'}]} onClick={handleTabChange}>
          <AtTabsPane index={0} current={currentTab} className='card-detail-pane'>
            <View className='card-detail-pane-content' >
              <Canvas className='canvas' style='width: 150px; height: 150px;' canvasId='myQrcode'></Canvas>
              <View>诊疗卡号：{card.cardNo}</View>
            </View>
          </AtTabsPane>
          <AtTabsPane index={1} current={currentTab} className='card-detail-pane'>
            {
              card && card.qrCode ?
              <View className='card-wrap'>
                <Image src={`data:image/jpg;base64,${card.qrCode}`} className='card-image' />
                <Image src={nrhcPng} className='card-icon' />
              </View>
              :
              <View className='card-wrap'>
                暂未升级电子健康卡
              </View>
            }
            
          </AtTabsPane>
          </AtTabs>
          
        <View className='card-tips'>出诊时出示此二维码</View>
      </BkPanel>
      <AtAccordion title='更多信息' open={open} onClick={() => {setOpen(!open)}}>
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
            <View>{card.idenNo.replace(/(\d{4})\d*([0-9a-zA-Z]{4})/, "$1******$2" )}</View>
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
      </AtAccordion>
      
      <View className='btns'>
        <BkButton title='解除绑定' onClick={handleUnBind} loading={busy} />
      </View>
    </View>
  )
}