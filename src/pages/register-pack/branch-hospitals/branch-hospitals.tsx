import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useEffect,useState } from 'react'
import { fetchBranchHospital } from '@/service/api/register-api'
import BkPanel from '@/components/bk-panel/bk-panel'
import { CardsHealper } from '@/utils/index'
import { CARD_ACTIONS } from '@/enums/index'

export default function BranchHospitals() {
  const [list,setList] = useState([])
  useEffect(() => {
    fetchBranchHospital(true).then((res) => {
      // console.log('branch hospitals',res);
      if(res.resultCode === 0){
        if(res.data.length === 1){
          navToRegisterPage()
        }else{
          checkRegisterMode()
          setList(res.data)
        }
      }
    })
  },[])
  const navToRegisterPage = () => {
    console.log('nav to register page');
    Taro.redirectTo({
      url: '/pages/register-pack/clinics/clinics'
    })
  }
  const checkRegisterMode = () => {
    console.log('check register mode');
    
  }
  const onClickPanel = (e) => {
    Taro.setStorageSync('hospitalInfo',e)
    CardsHealper.updateAllCards().then(() => {
      Taro.eventCenter.trigger(CARD_ACTIONS.UPDATE_ALL)
      Taro.redirectTo({
        url: '/pages/register-pack/clinics/clinics'
      })
    })
    
  }
  return (
    <View className='branches'>
      {
        list.map((item:any,index) => 
          <BkPanel style='margin: 20rpx;' key={index} arrow onClick={onClickPanel.bind(null,item)} >
            <View className='panel'>
              <View className='panel-name'>{item.hospitalName}</View>
            </View>
          </BkPanel>
        )

      }
    </View>
  )
}