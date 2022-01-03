import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import './order-list.less'
import { cancelAppointment, fetchRegInvoiceInfo, fetchRegOrderList } from '@/service/api'
import HealthCards from '@/components/health-cards/health-cards'
import BkTabs from '@/components/bk-tabs/bk-tabs'
import { useState, useEffect, useCallback } from 'react'
import { toastService } from '@/service/toast-service'
import BkNone from '@/components/bk-none/bk-none'
import BkButton from '@/components/bk-button/bk-button'
import { checkOverDate } from '@/utils/tools'
import BaseModal from '@/components/base-modal/base-modal'

const tabs = [{title: '15日内订单',value: 'current'},{title: '历史订单',value: 'history'}]

export default function OrderList() {
  const [currentTab,setCurrentTab] = useState(0)
  const [list,setList] = useState([])
  const [order,setOrder] = useState({
    patientName: '',
    totalFee: '',
    orderId: ''
  })
  const [show,setShow] = useState(false)
  const onConfirm = () => {
    setShow(false)
    Taro.showLoading({title: '正在取消……'})
    cancelAppointment({orderId: order.orderId}).then(res => {
      if(res.resultCode === 0){
        toastService({title: '取消成功！'})
        getList()
      }else{
        toastService({title: res.message})
      }
    }).finally(() => {
      Taro.hideLoading()
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
      if(res.resultCode === 0){
        const invoiceUrl = res.data.invoiceUrl
        Taro.setStorageSync('webViewSrc',invoiceUrl)
        Taro.navigateTo({url: '/pages/web-view-page/web-view-page'})
      }else{
        toastService({title: '获取电子发票失败：' + res.message})
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  }
  const getList = useCallback(() => {
    setList([])
    Taro.showLoading({title: '加载中……'})
    fetchRegOrderList({type: tabs[currentTab].value}).then(res => {
      if(res.resultCode === 0){
        setList(res.data)
      }else{
        toastService({title: res.message})
      }
    }).finally(() => {
      Taro.hideLoading()
    })
  },[currentTab])
  useEffect(() => {
    getList()
  },[currentTab,getList])
  useDidShow(() => {
    getList()
  })
  return(
    <View className='order-list'>
      <HealthCards switch />
      <BkTabs tabs={tabs} onTabChange={onTabChange} current={currentTab} />
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
                    <View className='order-list-card-text'>{item.orderStatusDesc}</View>
                  </View>
                }
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>订单编号：</View>
                  <View className='order-list-card-text'>{item.orderNo}</View>
                </View>
                <View className='order-list-card-item'>
                  <View className='order-list-card-title'>就诊人：</View>
                  <View className='order-list-card-text'>{item.patientName}</View>
                </View>
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
                  <View className='order-list-card-title'>订单编号：</View>
                  <View className='order-list-card-text'>{item.doctorName}</View>
                </View>
                {
                  item.visitNo &&
                  <View className='order-list-card-item'>
                    <View className='order-list-card-title'>流水号：</View>
                    <View className='order-list-card-text'>{item.visitNo}</View>
                  </View>
                }
                {
                  item.location &&
                  <View className='order-list-card-item'>
                    <View className='order-list-card-title'>就诊地址：</View>
                    <View className='order-list-card-text'>{item.location}</View>
                  </View>
                }
                {
                  item.serialNo && 
                  <View className='order-list-card-item'>
                    <View className='order-list-card-title'>电子发票：</View>
                    <View className='order-list-card-text clickable' onClick={showInvoice.bind(null,item)}>点击查看</View>
                  </View>
                }
                {
                  !checkOverDate(item.regDate) && item.orderStatus !== 24 &&
                  <View style='padding: 40rpx'>
                    <BkButton theme='danger' title='取消预约' onClick={showCancelModal.bind(this,item)} />
                  </View>
                }
              </View>  
            )
          }
        </view>
        :
        <BkNone />
      }
      <BaseModal show={show} closeOutside={false} confirm={onConfirm} cancel={onCancel} title='是否取消预约?' >
        <View className='order-list-modal'>
          <View>患者姓名：{order.patientName}</View>
          <View>退款金额：{order.totalFee}元</View>
        </View>
      </BaseModal>
    </View>
  )
}