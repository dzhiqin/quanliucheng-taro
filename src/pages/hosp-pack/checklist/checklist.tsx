import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { useState } from 'react'
import { getInHospBillList, getInHospInfo, TaroNavigateService } from '@/service/api'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import BkPanel from '@/components/bk-panel/bk-panel'
import calanderPng from '@/images/icons/calendar.png'
import MoneyPng from '@/images/icons/money_circle.png'
import './checklist.less'
import BkLoading from '@/components/bk-loading/bk-loading'
import PatientCard from '../components/patient-card/patient-card'

export default function BindingCard() {
  const [list,setList] = useState([])
  const [card,setCard] = useState(undefined)
  const [registerId, setRegisterId]= useState('')
  const [busy,setBusy] = useState(false)
  const handleGetInHospInfo = (_cardNo: string) => {
    return new Promise((resolve,reject) => {
      getInHospInfo({inCardNo: _cardNo})
      .then(res => {
        if(res.resultCode === 0){
          const _registerId = res.data.registerId
          setRegisterId(_registerId)
          resolve({result: true, data: _registerId})
        }else{
          resolve({result: false, data: ''})
        }
      })
      .catch(err => {
        resolve({result: false, data: err})
      })
    })
  }
  const getList = (_cardNo: string) => {
    setList([])
    setBusy(true)
    getInHospBillList({inCardNo: _cardNo}).then(res => {
      if(res.resultCode === 0){
        res.data && setList(res.data.billInfoList)
      }else{
        modalService({content: res.message})
      }
      setBusy(false)
    })
  }
  const handleClickItem = async (item) => {
    let _registerId =''
    if(!registerId){
      loadingService(true)
      const res:any = await handleGetInHospInfo(card.cardNo)
      if(res.result){
        loadingService(false)
        _registerId = res.data
      }else{
        toastService({title: '获取registerId失败',onClose:()=> loadingService(false)})
        return
      }
    }
    TaroNavigateService('hosp-pack','checklist-detail',`billDate=${item.billDate}&registerId=${registerId? registerId : _registerId}`)
  }
  const onPatientCard = (patientCard) => {
    setCard(patientCard)
    getList(patientCard.cardNo)
    handleGetInHospInfo(patientCard.cardNo)
  }
  return(
    <View className='checklist'>
      <PatientCard onCard={onPatientCard} />
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
                    <View className='checklist-item-text price-color'>{item.costed}元</View>
                  </View>
                </BkPanel>
              )
            }
          </View>
          :
          <BkLoading loading={busy} msg='暂无每日清单数据' />
        }
        
      </View>
    </View>
  )
}