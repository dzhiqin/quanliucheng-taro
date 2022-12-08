import * as Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { View, Image, RichText } from '@tarojs/components'
import * as React from 'react'
import {custom} from '@/custom/index'
import FunctionBoxes from '@/components/function-boxes/function-boxes'
import HealthCards from '@/components/health-cards/health-cards'
import NavCard from '@/components/nav-card/nav-card'
import QuickEntrance from '@/components/quick-entrance/quick-entrance'
import HospBlog from '@/components/hosp-blog/hosp-blog'
import { MyContext } from '@/utils/my-context'
import BaseModal from '@/components/base-modal/base-modal'
import { fetchClinicNotice } from '@/service/api'
import parse from 'mini-html-parser2';
import './index.less'
import { toastService } from '@/service/toast-service'

export default function Index() {
  const [indexPage] = useState(custom.indexPage)
  const [clinicNotice,setClinicNotice] = useState(undefined)
  const [show,setShow] = useState(false)
  
  useEffect(() => {
    Taro.setNavigationBarTitle({title: custom.hospitalName})
    Taro.removeStorageSync('isReg')
    if(custom.hospName === 'lwzxyy'){
      // 特殊处理
      fetchClinicNotice().then(res => {
        console.log(res);
        if(res.resultCode ===0){
          setShow(true)
          parse(res.data,(err,nodes) => {
            if(!err){
              setClinicNotice(nodes)
            }else{
              toastService({title: 'parse错误'})
            }
          })
        }
      })
      // setShow(true)
    }
  }, [])
  const onConfirm = () => {
    setShow(false)
  }
  const NoticeItem = (props) => {
    return(
      <View className='notice-item'>{props.children}</View>
    )
  }
  // const NoticeContent = () => {
  //   return(
  //     <View className='notice'>
  //       <View>广大患者朋友：</View>
  //       <View>即日起，我院的软件系统成功升级。为让广大患者朋友有更好的就医体验，现将我院门诊就诊须知指引告知。请您按照最新疫情防控的要求，配合完成“四必查一询问”，就诊时请您务必配合以下事项：</View>
  //       <NoticeItem>1、我院实行分时段预约诊疗，分时段报到候诊。为减少人群聚集，请根据预约时段提前15分钟在自助机报到候诊，请勿过早往医院候诊。微信公众号线上挂号优先就诊、门诊大厅提供现场人工挂号。因系统软件升级现场人工挂号请到一楼挂号处挂号，目前现场人工挂号(限号)不需要报到，直接到对应诊疗区域候诊。微信公众号线上预约成功后，患者需要自行到自助机报到（门诊1-4楼均设置有自助报到机），请凭身份证、新版医保卡或就诊条形码进行报到取号后排队；</NoticeItem>
  //       <NoticeItem>2、未能按预约时间到达的患者，在到达自助机报到后，顺延到报到时间段的下一时间段末尾。</NoticeItem>
  //       <NoticeItem>3、现场报到后，过号未能及时进入诊室的患者，自动顺延1位。第2次或以上过号，患者需要重新到自助机上报到。</NoticeItem>
  //       <NoticeItem>4、需再次回诊患者（咨询当次就诊检查结果的患者），则需要自行到自助机或分诊台重新报到 ，加入叫号队列，优先插入到目前就诊病人的下一位。</NoticeItem>
  //       <NoticeItem>5、专家门诊资源有限，请慎重选择就诊科室、医生及时间，确认信息无误后缴费。如患者预约挂号成功后因自身原因造成无法就诊，请至少提前一个工作日在微信公众号取消预约，以免影响预约就诊。凡是一季度内累计三次爽约将影响您以后的预约功能。</NoticeItem>
  //       <View>感谢您的支持与配合，祝您及家人身体健康！</View>
  //     </View>
  //   )
  // }
  return (
    <View className='index'>
      <BaseModal show={show} hideCancel confirm={onConfirm} title='门诊就诊须知'>
        {/* <NoticeContent /> */}
        <RichText nodes={clinicNotice} />
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