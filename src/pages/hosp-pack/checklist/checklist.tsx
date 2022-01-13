import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import SimpleModal from '@/components/simple-modal/simple-modal'
import { useState } from 'react'
import { fetchInHospBillList, fetchInHospCards } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'
import BkPanel from '@/components/bk-panel/bk-panel'
import calanderPng from '@/images/icons/calendar.png'
import MoneyPng from '@/images/icons/money_circle.png'
import './checklist.less'
import BkNone from '@/components/bk-none/bk-none'

export default function BindingCard() {
  const [showModal,setShowModal] = useState(false)
  const [list,setList] = useState([])
  Taro.useDidShow(() => {
    fetchInHospCards().then(res => {
      console.log(res);
      if(res.resultCode === 0){
        if(res.data && res.data.length > 0){
          const hospCard = res.data.find(i => i.isDefault)
          getList(hospCard.cardNo)
        }else{
          setShowModal(true)
        }
      }
    })
  })
  const getList = (cardNo: string) => {
    loadingService(true)
    fetchInHospBillList({inCardNo: cardNo}).then(res => {
      if(res.resultCode === 0){
        loadingService(true)
        setList(res.data.billInfoList)
      }else{
        toastService({title: '' + res.message})
      }
    })
  }
  const handleClickItem = (item) => {
    console.log('item',item) 
  }
  const handleConfirm = () => {
    // Taro.navigateTo({url: '/pages/hosp-pack/binding-card/binding-card'})
    // 广三线下绑卡
    Taro.navigateBack()
  }
  return(
    <View className='checklist'>
      <SimpleModal msg='请先绑卡' show={showModal} onCancel={() => setShowModal(false)} onConfirm={handleConfirm} />
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