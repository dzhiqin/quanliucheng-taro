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
import BaseModal from '@/components/base-modal/base-modal'
import './index.less'

export default function Index() {
  const [indexPage] = useState(custom.indexPage)
  const [show,setShow] = useState(false)
  
  
  useEffect(() => {
    Taro.setNavigationBarTitle({title: custom.hospitalName})
    Taro.removeStorageSync('isReg')
    if(custom.hospName === 'lwzxyy'){
      // 特殊处理
      setShow(true)
    }
  }, [])
  if(process.env.TARO_ENV === 'weapp'){
    wx.onCopyUrl(() => {
      console.log('copy url');
    })
  }
  const onConfirm = () => {
    setShow(false)
  }
  const NoticeItem = (props) => {
    return(
      <View className='notice-item'>{props.children}</View>
    )
  }
  const NoticeContent = () => {
    return(
      <View className='notice'>
        <View>广大患者朋友：</View>
        <View>即日起，我院的软件系统成功升级。为让广大患者朋友有更好的就医体验，现将我院门诊就诊须知指引告知，并按照最新疫情防控的要求，请您就诊时务必配合以下工作：</View>
        <NoticeItem>1、我院实行分时段预约诊疗，分时段报到候诊。为减少人群聚集，请根据预约时段提前15分钟在自助机报到候诊，请勿过早往医院候诊。微信挂号优先就诊、门诊大厅提供现场人工挂号。因系统软件升级现场人工挂号请到一楼挂号处挂号，目前现场人工挂号(限号)不需要报到，直接到对应诊疗区域候诊。微信预约患者预约挂号成功后，患者需要自行到自助机（门诊1-4楼均有自助报到机）请凭借身份证、新版医保卡或就诊条形码进行报到排队；</NoticeItem>
        <NoticeItem>2、未能按预约时间到达的患者，在到达自助机报到后，顺延到报到时间段的下一时间段末尾。</NoticeItem>
        <NoticeItem>3、现场报到后，过号未能及时进入诊室的患者，自动顺延1位。第2次或以上过号，患者需要重新到自助机上报到。</NoticeItem>
        <NoticeItem>4、需再次回诊患者（咨询当次就诊检查结果的患者），则需要自行到自助机或分诊台重新报到 ，加入叫号队列，优先插入到目前就诊病人的下一位。</NoticeItem>
        <NoticeItem>5、未在当班次就诊者视为违约，如患者预约挂号成功后未能及时到院就诊，同一预约人1年内爽约累计3次的自最后一次的爽约日起暂停3个月的预约服务，可以现场挂号就医。</NoticeItem>
        <View>感谢您的支持配合，祝您及家人身体健康！</View>
      </View>
    )
  }
  return (
    <View className='index'>
      <BaseModal show={show} hideCancel confirm={onConfirm} title='门诊就诊须知'>
        <NoticeContent />
      </BaseModal>
      <MyContext.Provider value={indexPage}>
        {indexPage.banner.enable && <Image src={indexPage.banner.url} className='banner'></Image>}
        {indexPage.healthCard.enable && <HealthCards />}
        {indexPage.navCard.enable && <NavCard></NavCard>}
        {indexPage.functionBox.enable && <FunctionBoxes ></FunctionBoxes>}
        {indexPage.quickEntrance.enable && <QuickEntrance quickEntrance={indexPage.quickEntrance}></QuickEntrance>}
        {indexPage.hospBlog.enable && <HospBlog></HospBlog>}
      </MyContext.Provider>
    </View>
  )
}