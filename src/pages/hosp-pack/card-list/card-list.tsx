import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View,Image } from '@tarojs/components'
import { useState } from 'react'
import BkLoading from '@/components/bk-loading/bk-loading'
import BkButton from '@/components/bk-button/bk-button'
import { AtList, AtListItem, AtButton } from 'taro-ui'
import { fetchInHospCards,setDefaultInHospCard, TaroNavigateService, unbindHospCard } from '@/service/api'
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
        Taro.setStorageSync('hospCard',res.data.find(i => i.isDefault))
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
        setList(list.map(item => {return {...item,isDefault: item.id == card.id}}))
        Taro.setStorageSync('hospCard',card)
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
  const handleUnbind = (_card) => {
    modalService({content: '是否要解绑此住院卡', showCancel: true, success: (res) => {
      if(res.confirm){
        unbindHospCard({id: _card.id}).then(cardRes => {
          if(cardRes.resultCode === 0){
            handleUnbindSuccess(_card)
          }else{
            modalService({title: '解绑失败',content: cardRes.message,showCancel: false})
          }
        }).catch(err => {
          modalService({title: '解绑失败',content: err+'',showCancel: false})
        })
      }
    }})
  }
  const resetDefaultCard = (newList) => {
    const defaultId = newList[0].id
    setDefaultInHospCard({id: defaultId}).then(res => {
      if(res.resultCode === 0){
        Taro.setStorageSync('hospCard',newList[0])
        setList(newList.map(i => {return {...i,isDefault: i.id === defaultId}}))
      }else{
        modalService({content: res.message,title: '自动默认卡失败'})
      }
    })
  }
  const handleUnbindSuccess = (_card) => {
    setShow(false)
    const newList = list.filter(i => i.id !== _card.id)
    console.log('unbind success new list',newList);
    
    if(newList.length === 0) {
      setList([])
      Taro.removeStorageSync('hospCard')
      return
    }
    if(_card.isDefault){
      resetDefaultCard(newList)
    }else{
      setList(newList)
    }
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
          <View style='padding: 20rpx'>
            <AtButton onClick={handleUnbind.bind(null,currentCard)} size='small' type='primary' full={false}>解除绑定</AtButton>
          </View>
        </View>
      </BaseModal>
    </View>
  )
}