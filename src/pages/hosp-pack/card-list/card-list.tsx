import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import { useState } from 'react'
import BkLoading from '@/components/bk-loading/bk-loading'
import BkButton from '@/components/bk-button/bk-button'
import { AtList, AtListItem } from 'taro-ui'
import { fetchInHospCards,setDefaultInHospCard, TaroNavigateService } from '@/service/api'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import QrCode from 'qrcode'
import BaseModal from '@/components/base-modal/base-modal'

export default function CardList(){
  const [list,setList] = useState([])
  const [show,setShow] = useState(false)
  const [qrcodeSrc,setQrcodeSrc] = useState(undefined)
  const [currentCard,setCard] = useState(undefined)

  Taro.useDidShow(() => {
    getList()
  })
  const getList = () => {
    loadingService(true)
    fetchInHospCards().then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
    })
  }
  const handleClickItem = (_card) => {
    setShow(true)
    setCard(_card)
    QrCode.toDataURL(_card.cardNo).then(url => {
      setQrcodeSrc(url)
    })
  }

  const handleSetDefault = () => {
    if(currentCard.isDefault) return
    Taro.showModal({
      content: '是否设置为默认卡？',
      success: result => {
        if(result.confirm){
          setDefaultCard(currentCard)
        }
      }
    })
  }
  const setDefaultCard = (card) => {
    loadingService(true)
    setDefaultInHospCard({id: card.id}).then(res => {
      if(res.resultCode === 0){
        const _cards = Taro.getStorageSync('patientCards')
        Taro.setStorageSync('patientCards',_cards.map(item => {return {...item,isDefault: item.id == card.id}}))
        toastService({title: '设置成功',duration: 1500,
        onClose: () => {
          Taro.navigateBack();
          loadingService(false)
        }, })
      }else{
        loadingService(false)
        modalService({title: '操作失败', content: res.message})
      }
    }).catch(err => {
      loadingService(false)
      modalService({content: JSON.stringify(err)})
    })
  }
  return(
    <View>
      {
        list && list.length > 0
        ?
        <AtList>
          {
            list.map((item,index) => 
              <AtListItem
                key={index}
                arrow='right'
                note={item.cardNo}
                title={item.name}
                extraText={item.isDefault ? '默认卡' : ''}
                iconInfo={{ size: 25, color: '#FF4949', value: 'credit-card' }}
                onClick={handleClickItem.bind(null,item)}
              />
            )
          }
          
        </AtList>
        :
        <BkLoading msg='暂未绑定住院卡' />
      }
      <View style='padding: 60rpx'>
        <BkButton title='绑卡' onClick={() => TaroNavigateService('hosp-pack', 'binding-card')} />
      </View>
      <BaseModal show={show} cancel={() => setShow(false)} confirm={() => {setShow(false);handleSetDefault()}} title='住院号' confirmText='设为默认'>
        <View className=''>
          {
            qrcodeSrc &&
            <Image style='width: 250px; height: 250px;' src={qrcodeSrc}></Image>
          }
          <View>姓名：{currentCard?.name}</View>
          <View>住院号：{currentCard?.cardNo}</View>
        </View>
      </BaseModal>
    </View>
  )
}