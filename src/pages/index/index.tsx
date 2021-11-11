import * as Taro from '@tarojs/taro'
import { Component, useEffect, useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import * as React from 'react'
import BkButton from '@/components/bk-button/bk-button'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import config from '@/config/index'
import FunctionBoxes from '@/components/function-boxes/function-boxes'
import HealthCards from '@/components/health-cards/health-cards'
import NavCard from '@/components/nav-card/nav-card'
import QuickEntrance from '@/components/quick-entrance/quick-entrance'
import { MyContext } from '@/utils/my-context'
import './index.less'

export default function Index() {
  const [indexPage] = useState(config.indexPage)
  
  const onSubmit = (e) => {
    console.log('onSubmit',e)
  }
 
  useEffect(() => {
    Taro.setNavigationBarTitle({title: config.hospitalName})
    return () => {
      // cleanup
    }
  }, [])
  return (
    <View className='index'>
      <MyContext.Provider value={indexPage}>
        {indexPage.banner.enable ? <Image src={indexPage.banner.url} className='banner'></Image> : ''}
        {indexPage.healthCard.enable ? <HealthCards>healthCard</HealthCards> : ''}
        {indexPage.navCard.enable ? <NavCard>navCard</NavCard> : ''}
        {indexPage.functionBox.enable? <FunctionBoxes >funbox</FunctionBoxes> : ''}
        {indexPage.quickEntrance.enable? <QuickEntrance>quickEntrance</QuickEntrance> : ''}
        {indexPage.hospBlog.enable ? <View>hospBlog</View> : ''}
      </MyContext.Provider>
      
      {/* <BkButton name='click me!'  setSubmit={onSubmit} theme='danger'></BkButton> */}
      {/* <BkButton name='click here' icon='wechat.png' setSubmit={this.onSubmit.bind(this)} theme='info'></BkButton> */}
    </View>
  )
}