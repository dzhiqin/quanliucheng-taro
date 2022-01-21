import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import SimpleModal from '@/components/simple-modal/simple-modal'
import { useState } from 'react'
import { getInHospBillList, fetchInHospCards, getInHospInfo } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import BkPanel from '@/components/bk-panel/bk-panel'
import calanderPng from '@/images/icons/calendar.png'
import MoneyPng from '@/images/icons/money_circle.png'
import './checklist.less'
import BkNone from '@/components/bk-none/bk-none'
import { AtList,AtListItem } from 'taro-ui'

export default function BindingCard() {
  const [showModal,setShowModal] = useState(false)
  const [list,setList] = useState([])
  const [card,setCard] = useState(null)
  const [registerId, setRegisterId]= useState('')
  Taro.useReady(() => {
    let _card = Taro.getStorageSync('inCard')
    if(_card){
      setCard(_card)
      getList(_card.cardNo)
      handleGetInHospInfo(_card.cardNo)
    }else{
      fetchInHospCards().then(res => {
        if(res.resultCode === 0){
          if(res.data && res.data.length > 0){
            setShowModal(false)
            const hospCard = res.data.find(i => i.isDefault)
            Taro.setStorageSync('inCard',hospCard)
            setCard(hospCard)
            getList(hospCard.cardNo)
            handleGetInHospInfo(hospCard.cardNo)
          }else{
            setShowModal(true)
          }
        }
      })
    }
  })
  Taro.useDidShow(() => {
    const currentCard = Taro.getStorageSync('inCard')
    if(card && currentCard.id !== card.id) {
      setCard(currentCard)
      getList(currentCard.cardNo)
      handleGetInHospInfo(currentCard.cardNo)
    }
  })
  const handleGetInHospInfo = (_cardNo: string) => {
    return new Promise((resolve,reject) => {
      getInHospInfo({inCardNo: _cardNo})
      .then(res => {
        if(res.resultCode === 0){
          const _registerId = res.data.registerId
          setRegisterId(_registerId)
          resolve({result: true, data: _registerId})
        }else{
          reject({result: false, data: ''})
        }
      })
      .catch(err => {
        reject({result: false, data: err})
      })
    })
  }
  const getList = (_cardNo: string) => {
    loadingService(true)
    getInHospBillList({inCardNo: _cardNo}).then(res => {
      if(res.resultCode === 0){
        loadingService(false)
        setList(res.data.billInfoList)
      }else{
        toastService({title: '' + res.message})
      }
    })
  }
  const handleClickItem = async (item) => {
    let _registerId =''
    if(!registerId){
      loadingService(true)
      const res:any = await handleGetInHospInfo(card.cardNo)
      loadingService(false)
      if(res.result){
        _registerId = res.data
      }else{
        toastService({title: '获取registerId失败'})
        return
      }
    }
    Taro.navigateTo({url: `/pages/hosp-pack/checklist-detail/checklist-detail?billDate=${item.billDate}&registerId=${registerId? registerId : _registerId}`})
  }
  const handleConfirm = () => {
    Taro.navigateTo({url: '/pages/hosp-pack/binding-card/binding-card'})
    // Taro.navigateBack()
  }
  return(
    <View className='checklist'>
      <SimpleModal msg='请先绑卡' show={showModal} onCancel={() => setShowModal(false)} onConfirm={handleConfirm} />
      {
        card &&
        <AtList>
          <AtListItem
            arrow='right'
            note={card.cardNo}
            title={card.name}
            iconInfo={{ size: 25, color: '#FF4949', value: 'credit-card', }}
            onClick={() => Taro.navigateTo({url: '/pages/hosp-pack/card-list/card-list'})}
          />
        </AtList>
      }
      
      <View className='checklist-content'>
        {
          list.length > 0 
          ?
          <View>
            {
              list.map((item,index) => 
                <BkPanel key={index} style='margin-bottom: 30rpx' onClick={handleClickItem.bind(null, item)}>
                  <View className='checklist-item'>
                    <Image src={calanderPng} className='checklist-item-icon' />
                    <View className='checklist-item-title flat-title'>日期:</View>
                    <View className='checklist-item-text'>{item.billDate}</View>
                  </View>
                  <View className='checklist-item'>
                    <Image src={MoneyPng} className='checklist-item-icon' />
                    <View className='checklist-item-title flat-title'>费用:</View>
                    <View className='checklist-item-text price-color'>{item.costed}</View>
                  </View>
                </BkPanel>
              )
            }
          </View>
          :
          <BkNone msg='暂无每日清单数据' />
        }
        
      </View>
    </View>
  )
}