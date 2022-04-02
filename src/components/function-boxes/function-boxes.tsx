import { useContext,useState,useEffect } from 'react'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { MyContext } from '@/utils/my-context'
import { View } from '@tarojs/components'
import { fetchBranchHospital } from '@/service/api/register-api'
import {custom} from '@/custom/index'

import RegisterNoticeModal from '../register-notice-modal/register-notice-modal'
import BoxItem from './box-item'
import './function-boxes.less'
import { loadingService, toastService } from '@/service/toast-service'
import { TaroRemindLoginModal } from '@/service/api'

export default function FunctionBoxes(props) {
   const {functionBox} = useContext(MyContext)
   const [show,setShow] = useState(false)
   const onItemClick = (item) => {
      if(item.event === 'register'){
        if(custom.feat.register.popupNotice){
          setShow(true)
        }else{
          navToPage()
        }
      }else{
        Taro.navigateTo({url: item.url})
      }
   }
 
    const onConfirm = () => {
      setShow(false)
      navToPage()
    }
    const navToPage = () => {
      if(!Taro.getStorageSync('cards')){
        TaroRemindLoginModal()
        return
      }
      loadingService(true)
      fetchBranchHospital().then(res => {
        if(res.resultCode === 0){
          loadingService(false)
          const hospitalCount = res.data.length
          if(hospitalCount === 1){
            let url = ''
            if(custom.feat.register.guangSanMode){
              url = `/pages/register-pack/notice/notice`
            }else{
              url = `/pages/register-pack/clinics/clinics`
            }
            Taro.navigateTo({url})
          }else{
            Taro.navigateTo({
              url: '/pages/register-pack/branch-hospitals/branch-hospitals'
            })
          }
        }else{
          toastService({title: '获取分院出错：' + res.message})
        }
      })
    } 
    return (
      <View className='function-box-container'>
        {
          functionBox.list.map((item,index) => <BoxItem key={index} item={item} onClick={onItemClick.bind(this)}>list</BoxItem>)
        }
        {
          custom.feat.register.popupNotice && <RegisterNoticeModal show={show} onConfirm={onConfirm.bind(this)} />  
        }
      </View>
    )      
}