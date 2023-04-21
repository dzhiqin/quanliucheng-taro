import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { useState } from 'react'
import { View } from '@tarojs/components'
import HospCards from '@/components/hosp-cards/hosp-cards'
import { fetchInpatientRegNotices, fetchInpatientRegInfo, TaroNavigateService } from '@/service/api'
import BkLoading from '@/components/bk-loading/bk-loading'
import BkPanel from '@/components/bk-panel/bk-panel'
import { INPATIENT_REG_STATUS } from '@/enums/index'
import { modalService } from '@/service/toast-service'
import BaseModal from '@/components/base-modal/base-modal'

export default function InpatientNotices() {
  const [currentCard,setCurrentCard] = useState({idenNo: '', patientName: ''})
  const [list,setList] = useState([])
  const [hasNewNotice, setHasNewNotice] = useState(false)
  const [busy, setBusy] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [record, setRecord] = useState({inHospDate: '',brxm: '',sfzh: '',brzyid:'',brxb:''})
  const onHospCard = (card) => {
    getList(card)
    setCurrentCard(card)
  }
  const getList = (card) => {
    fetchInpatientRegNotices({idenNo: card.idenNo, patientName: card.patientName}).then(res => {
      setBusy(false)
      if(res.resultCode === 0){
        // setList(res.data.item)
        // setHasNewNotice(res.data.item.some(item => item.inType == 0))
      }else{
        // modalService({content: res.message})
      }
    })
    setHasNewNotice(true)
    setList([
      {inHospDate: '2023-04-10',deptName: '科室名称', inType: 1},
      {inHospDate: '2023-05-11',deptName: '科室名称', inType: 0},
    ])
  }
  const handleClickItem = (item) => {
    console.log('click:', item);
    if(item.inType === INPATIENT_REG_STATUS.NOT_SUBMIT){
      TaroNavigateService('hosp-pack','inpatient-registration')
    }
    if(item.inType === INPATIENT_REG_STATUS.SUBMITTED){
      console.log('show details');
      fetchInpatientRegInfo({idenNo: currentCard.idenNo, patientName: currentCard.patientName, inHospDate: item.inHospDate}).then(res => {
        if(res.resultCode ===0){
          setShowModal(true)
          setRecord(res.data.item[0])
        }else{
          modalService({content: res.message})
        }
      })
      setShowModal(true)
      setRecord({inHospDate: item.inHospDate, brxm: '患者姓名', sfzh: '11123332221111', brzyid: '23123', brxb: '男'})
    }
  }
  return(
    <View>
      <HospCards onCard={onHospCard} />
      {
        hasNewNotice && 
        <View className='price-color'>注意：您有新的入院通知单，请进入登记相关信息</View>
      }
      <View style='padding: 0 40rpx;'>
        {
          list.length ?
          <View style='margin-top: 20rpx'>
            {
              list.map((item, index) => <BkPanel key={index} style='margin-bottom: 30rpx' onClick={handleClickItem.bind(null,item)}>
                <View className='panel-item'>
                  <View className=''>
                    <View>{item.inHospDate}</View>
                    <View>{item.deptName}</View>
                  </View>
                  <View className={item.inType === INPATIENT_REG_STATUS.NOT_SUBMIT ? 'price-color' : 'primary-text-color'}>
                    {item.inType === INPATIENT_REG_STATUS.NOT_SUBMIT ? '未提交' : '已完成'}
                  </View>
                </View>
              </BkPanel>)
            }
          </View> :
          <BkLoading msg={busy ? '加载中' : '暂无记录'} />
        }
      </View>
      <BaseModal show={showModal} confirm={() => setShowModal(false)} title='登记信息' hideCancel>
        <View className='panel-item'>
          <View>通知时间</View>
          <View>{record.inHospDate}</View>
        </View>
        <View className='panel-item'>
          <View>患者姓名</View>
          <View>{record.brxm}</View>
        </View>
        <View className='panel-item'>
          <View>性别</View>
          <View>{record.brxb}</View>
        </View>
        <View className='panel-item'>
          <View>身份证号</View>
          <View>{record.sfzh}</View>
        </View>
        <View className='panel-item'>
          <View>住院号</View>
          <View>{record.brzyid}</View>
        </View>
      </BaseModal>
    </View>
  )
}