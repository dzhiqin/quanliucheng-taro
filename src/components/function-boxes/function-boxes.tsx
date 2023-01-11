import { useContext,useState } from 'react'
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { MyContext } from '@/utils/my-context'
import { View } from '@tarojs/components'
import {custom} from '@/custom/index'

import RegisterNoticeModal from '../register-notice-modal/register-notice-modal'
import BoxItem from './box-item'
import './function-boxes.less'
import { modalService } from '@/service/toast-service'
import { TaroNavigateService } from '@/service/api'

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
        TaroNavigateService(item.url)
      }
   }
 
    const onConfirm = () => {
      setShow(false)
      navToPage()
    }
    const navToPage = () => {
      const branches = Taro.getStorageSync('branches')
      const hospInfo = Taro.getStorageSync('hospitalInfo')
      let url = ''
      if(!branches || branches.length === 0){
        modalService({content: '医院信息为空'})
        return
      }

      if(hospInfo){
        // 已选择了院区
        if(custom.feat.register.intradayAndAppointment){
          url = `/pages/register-pack/notice/notice` // 区分当天挂号和预约挂号的先跳转到挂号须知页面
        }else{
          url = `/pages/register-pack/clinics/clinics`// 不区分当天挂号和预约挂号的，直接跳转的选择科室页面
        }
      }else{
        // 未选择院区的，进入选择院区页面
        url = '/pages/register-pack/branch-hospitals/branch-hospitals'
      }
      TaroNavigateService(url)
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