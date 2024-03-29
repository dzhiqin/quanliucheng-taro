import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import './order-list.less'
import { cancelAppointment, fetchRegInvoiceInfo, fetchRegOrderList,TaroNavToMiniProgram } from '@/service/api'
import HealthCards from '@/components/health-cards/health-cards'
import { useState, useEffect, useCallback } from 'react'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import BkButton from '@/components/bk-button/bk-button'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import BkLoading from '@/components/bk-loading/bk-loading'
import { checkOverTime, getPrivacyName } from '@/utils/tools'
import BaseModal from '@/components/base-modal/base-modal'
import { custom } from '@/custom/index'
import {REGISTER_ORDER_STATUS} from '@/enums/index'
import { reportCmPV_YL } from '@/utils/cloudMonitorHelper'

const tabs = [{title: '15日内订单',value: 'current'},{title: '历史订单',value: 'history'}]
const registerConfig = custom.feat.register

export default function OrderList() {
  const [currentTab,setCurrentTab] = useState(0)
  const [list,setList] = useState([])
  const [busy,setBusy] = useState(false)
  const [order,setOrder] = useState({
    patientName: '',
    totalFee: '',
    orderId: ''
  })
  const [show,setShow] = useState(false)
  const onConfirm = () => {
    setShow(false)
    loadingService(true,'正在取消……')
    cancelAppointment({orderId: order.orderId}).then(res => {
      if(res.resultCode === 0){
        toastService({title: '取消成功！',onClose: ()=>loadingService(false)})
        getList()
      }else{
        loadingService(false)
        modalService({content: res.message})
      }
    })
  }
  const onCancel = () => {
    setShow(false)
  }
  const onTabChange = (index) => {
    setCurrentTab(index)
  }
  const showCancelModal = (e) => {
    setOrder(e)
    setShow(true)
  }
  const showInvoice = (item) => {
    Taro.showLoading({title: '加载中……',mask:true})
    fetchRegInvoiceInfo({serialNo: item.serialNo}).then(res => {
      Taro.hideLoading()
      if(res.resultCode === 0){
        const invoiceUrl = res.data.invoiceUrl
        const pathParams = `pages/invoiceDisplayDWDZ/invoiceDisplayDWDZ?q=${encodeURIComponent(invoiceUrl)}`
        TaroNavToMiniProgram({
          appId: 'wx8e0b79a7f627ca18',
          path: pathParams
        })
        // Taro.navigateTo({url: '/pages/web-view-page/web-view-page'})
      }else{
        modalService({title: '获取电子发票失败：',content: res.message})
      }
    }).catch(() => {
      Taro.hideLoading()
    })
  }
  const getList = useCallback(() => {
    setList([])
    setBusy(true)
    fetchRegOrderList({type: tabs[currentTab].value}).then(res => {
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        modalService({content: res.message})
      }
      setBusy(false)
    })
  },[currentTab])
  useEffect(() => {
    getList()
  },[currentTab,getList])
  Taro.useReady(() => {
    if(custom.feat.guangHuaMonitor.enable){
      reportCmPV_YL({title: '挂号记录查询'})
    }
  })
  const onCardChange = () => {
    getList()
  }
  return(
    <View className='order-list'>
      <View className='order-list-header'>
        <HealthCards switch onCard={onCardChange} />
        <BkTabs tabs={tabs} onTabChange={onTabChange} current={currentTab}  />
      </View>
      {
        list && list.length > 0 
        ?
        <view className='order-list-content'>
          {
            list.map(item => 
              <View className='order-list-card' key={item.orderId}>
                {
                  item.orderStatusDesc &&
                  <View className='order-list-card-item'>
                    <View className='order-list-card-title'>订单状态：</View>
                    <View className='order-list-card-text price-color'>{item.orderStatusDesc}</View>
                  </View>
                }
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>订单编号：</View>
                  <View className='order-list-card-text' style='overflow-wrap: anywhere;'>{item.orderNo}</View>
                </View>
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>就诊人：</View>
                  <View className='order-list-card-text'>{process.env.TARO_ENV === 'alipay' ? getPrivacyName(item.patientName) : item.patientName}</View>
                </View>
                {/* <View className='order-list-card-item'>
                  <View className='order-list-card-title'>诊疗卡号：</View>
                  <View className='order-list-card-text'>{card.cardNo}</View>
                </View> */}
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>已缴费：</View>
                  <View className='order-list-card-text'>￥{item.totalFee}</View>
                </View>
                
                <View style='border-bottom: 2rpx dashed #f5f5f5;height: 4rpx;width: 100%; margin-bottom: 20rpx'></View>
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>就诊日期：</View>
                  <View className='order-list-card-text'>{item.regDate}</View>
                </View>
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>就诊时间：</View>
                  <View className='order-list-card-text'>{item.startTime} - {item.endTime}</View>
                </View>
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>就诊科室：</View>
                  <View className='order-list-card-text'>{item.deptName}</View>
                </View>
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>就诊医生：</View>
                  <View className='order-list-card-text'>{item.doctorName}</View>
                </View>
                {
                  item.visitNo &&
                  <View className='order-list-card-item'>
                    <View className='order-list-card-title'>流水号：</View>
                    <View className='order-list-card-text' style='overflow-wrap: anywhere;'>{item.visitNo}</View>
                  </View>
                }
                {
                  item.location &&
                  <View className='order-list-card-item'>
                    <View className='order-list-card-title'>就诊地址：</View>
                    <View className='order-list-card-text'>{item.location}</View>
                  </View>
                }
                {/* {
                  item.regNo &&
                  <View className='order-list-card-item'>
                    <View className='order-list-card-title'>排队号：</View>
                    <View className='order-list-card-text'>{item.regNo}</View>
                  </View>
                } */}
                {
                  item.serialNo && 
                  <View className='order-list-card-item'>
                    <View className='order-list-card-title'>电子发票：</View>
                    <View className='order-list-card-text clickable' onClick={showInvoice.bind(null,item)}>点击查看</View>
                  </View>
                }
                {
                  !checkOverTime(item.regDate, item.startTime, registerConfig.cancelReservedTime) 
                  && item.orderStatus !== REGISTER_ORDER_STATUS.REFUND_AND_CANCEL_SUCCESS 
                  &&item.orderStatus !== REGISTER_ORDER_STATUS.REFUND_SUCCESS 
                  &&
                  <View style='padding: 40rpx'>
                    <BkButton theme='danger' title='取消预约' onClick={showCancelModal.bind(this,item)} />
                  </View>
                }
              </View>  
            )
          }
        </view>
        :
        <BkLoading style='margin-top: 300rpx' loading={busy} msg='暂无订单' />
      }
      {
        list && list.length > 0 && currentTab === 1 &&
        <View style='color: #bbb; text-align: center;'>最多显示近3个月的挂号订单</View>
      }
      <BaseModal show={show} closeOutside={false} confirm={onConfirm} cancel={onCancel} title='是否取消预约?' >
        <View className='order-list-modal'>
          <View>患者姓名：{process.env.TARO_ENV === 'alipay' ? getPrivacyName(order.patientName) : order.patientName}</View>
          <View>退款金额：{order.totalFee}元</View>
        </View>
      </BaseModal>
    </View>
  )
}