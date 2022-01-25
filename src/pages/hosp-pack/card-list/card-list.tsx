import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState } from 'react'
import BkNone from '@/components/bk-none/bk-none'
import BkButton from '@/components/bk-button/bk-button'
import { AtList, AtListItem } from 'taro-ui'
import { fetchInHospCards,setDefaultInHospCard } from '@/service/api'
import { loadingService, toastService } from '@/service/toast-service'

export default function CardList(){
  const [list,setList] = useState([])
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
        toastService({title: ''+res.message})
      }
    })
  }
  const handleClickItem = (card) => {
    if(card.isDefault) return
    Taro.showModal({
      content: '是否设置为默认卡？',
      success: result => {
        if(result.confirm){
          setDefaultCard(card)
        }
      }
    })
  }
  const setDefaultCard = (card) => {
    loadingService(true)
    setDefaultInHospCard({id: card.id}).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        Taro.setStorageSync('inCard',card)
        toastService({title: '设置成功',onClose: () => Taro.navigateBack(), duration: 1500})
      }else{
        toastService({title: '操作失败'+res.message})
      }
    }).catch(err => {
      toastService({title: '' + err})
    })
  }
  return(
    <View>
      {
        list.length > 0
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
        <BkNone msg='暂未绑定住院卡' />
      }
      <View style='padding: 60rpx'>
        <BkButton title='绑卡' onClick={() => Taro.navigateTo({url: '/pages/hosp-pack/binding-card/binding-card'})} />
      </View>
    </View>
  )
}