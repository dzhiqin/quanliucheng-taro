import * as Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Image } from '@tarojs/components'
import * as React from 'react'
import {custom} from '@/custom/index'
import FunctionBoxes from '@/components/function-boxes/function-boxes'
import HealthCards from '@/components/health-cards/health-cards'
import NavCard from '@/components/nav-card/nav-card'
import QuickEntrance from '@/components/quick-entrance/quick-entrance'
import HospBlog from '@/components/hosp-blog/hosp-blog'
import { MyContext } from '@/utils/my-context'
import './index.less'

export default function Index() {
  const [indexPage] = useState(custom.indexPage)
  useEffect(() => {
    Taro.setNavigationBarTitle({title: custom.hospitalName})
    Taro.removeStorageSync('isReg')
  }, [])
  return (
    <View className='index'>
      <MyContext.Provider value={indexPage}>
        {indexPage.banner.enable && <Image src={indexPage.banner.url} className='banner'></Image>}
        {indexPage.healthCard.enable && <HealthCards switch />}
        {indexPage.navCard.enable && <NavCard></NavCard>}
        {indexPage.functionBox.enable && <FunctionBoxes ></FunctionBoxes>}
        {indexPage.quickEntrance.enable && <QuickEntrance quickEntrance={indexPage.quickEntrance}></QuickEntrance>}
        {indexPage.hospBlog.enable && <HospBlog></HospBlog>}
      </MyContext.Provider>
    </View>
  )
}