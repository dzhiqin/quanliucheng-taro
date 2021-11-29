import * as Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import { useDidShow } from '@tarojs/taro'
import * as React from 'react'
import BkButton from '@/components/bk-button/bk-button'
import "taro-ui/dist/style/components/button.scss" // 按需引入
import custom from '@/custom/index'
import FunctionBoxes from '@/components/function-boxes/function-boxes'
import HealthCards from '@/components/health-cards/health-cards'
import NavCard from '@/components/nav-card/nav-card'
import QuickEntrance from '@/components/quick-entrance/quick-entrance'
import HospBlog from '@/components/hosp-blog/hosp-blog'
import { MyContext } from '@/utils/my-context'
import './index.less'

export default function Index() {
  const [indexPage] = useState(custom.indexPage)
  const [cards,setCards] = useState()
  useEffect(() => {
    Taro.setNavigationBarTitle({title: custom.hospitalName})
  }, [])
  useDidShow(() => {
    const res = Taro.getStorageSync('cards') || []
    setCards(res)
  })
  return (
    <View className='index'>
      <MyContext.Provider value={indexPage}>
        {indexPage.banner.enable && <Image src={indexPage.banner.url} className='banner'></Image>}
        {indexPage.healthCard.enable && <HealthCards cards={cards}>healthCard</HealthCards>}
        {indexPage.navCard.enable && <NavCard>navCard</NavCard>}
        {indexPage.functionBox.enable && <FunctionBoxes >funbox</FunctionBoxes>}
        {indexPage.quickEntrance.enable && <QuickEntrance quickEntrance={indexPage.quickEntrance}>quickEntrance</QuickEntrance>}
        {indexPage.hospBlog.enable && <HospBlog>hospBlog</HospBlog>}
      </MyContext.Provider>
      
      {/* <BkButton name='click me!'  setSubmit={onSubmit} theme='danger'></BkButton> */}
      {/* <BkButton name='click here' icon='wechat.png' setSubmit={this.onSubmit.bind(this)} theme='info'></BkButton> */}
    </View>
  )
}