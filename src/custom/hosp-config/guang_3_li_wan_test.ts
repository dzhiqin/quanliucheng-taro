import imgUrl from '@/utils/imgs'
// import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 23.117374,
  longitude: 113.234202,
  region: [],
  hospName: "gy3ylw",
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png',
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220309-basic/gysy.png",
  hospitalName: "广医三院荔湾院区",
  baseUrl: "https://applets.gdbkyz.com", // 倍康测试
  // baseUrl: "https://gysy.wedoublecare.com",  // 旧正式环境
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  indexPage: {
    banner: { // 轮播图组件
      enable: true,
      url: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/gy3ylw-banner.png'
    },
    quickEntrance: {
      enable: true,
      tabList: [
        {
          title: '门诊',
          entrances: [
            {
              icon: imgUrl.new_home_icon6,
              name: '报到候诊',
              event: 'navigate',
              url: '/pages/service-pack/arrival-service/arrival-service'
            },
            {
              icon: imgUrl.zybk,
              name: '免密授权',
              event: 'jump',
              appId: 'wxe183cd55df4b4369',
              path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=440108&channel=AAEU6mLvU996Qbbdes2YGUyz&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxscd12B4Dw4uCZ1AggyeinA&orgCodg=H44010300351&orgAppId=1GUHLD8UT0KK3F60C80A000002375CD7'
            }, 
          ]
        },
        {
          title: '住院',
          entrances: [
            {
              icon: imgUrl.zybk,
              name: '住院绑卡',
              event: 'navigate',
              url: '/pages/hosp-pack/binding-card/binding-card',
            }, 
            {
              icon: imgUrl.new_home_icon10,
              name: '住院押金',
              event: 'navigate',
              url: '/pages/hosp-pack/deposit/deposit',
            }, 
            {
              icon: imgUrl.new_home_icon11,
              name: '每日清单',
              event: 'navigate',
              url: '/pages/hosp-pack/checklist/checklist',
            }
          ]
        }
      ]
    }
  },
  feat: {
    wxLogger: true,
    bindCard: {
      rebind: true,
      updateNotice: true,
    },
    register: {
      popupNotice: false,
      intradayAndAppointment: true,// 是否区分当天挂号和预约挂号
      type: 'byCategoryAndDoctorAndTime',// byDept按科室挂号；byDeptAndTime按科室和时间挂号；byCategoryAndDoctorAndTime按分类、医生、日期挂号
      checkEpiLogicalSurvey: false, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: true,  // 院内导航
  },
  subscribes: {
    checkReminder: 'Af54bSkJ_kuYGe9k2jEgyJWhxOIKd6UgP3mKr6oKhgI', // 审方提醒 长期订阅
    pendingPayReminder: 'ltbmVOfr6ZdU7IcOfDOVqjG2tTe19pofN8T1FwBJYJI',// 待缴费提醒 长期订阅
    visitReminder: 'iybAnWjOjpH31TNV4N7cBXL7oqD9P3E22We4bnR3B-8', // 就诊提醒 长期订阅
    closeNotice: '5GR0iwW_CX-m2ZuEypkyHL3WiXFA_rgjaXBnuZa9vUY',// 医生停诊通知
    satisfactionSurveyNotice: 'oKLguFzLqP2fXOYFQB03OGdqkrniiuB-kNb9WEhA7ag',// 患者满意度调查提醒
    appointmentNotice: 'mu11HgcE7dqbn6eTafSspDhk7iu8QEHW9jbv35TJQbY', //挂号成功通知
    paySuccessNotice: 'MAu5jBFFWHlexlsDdFTd8B8u2jZZvnrTvLaTjHn9LGE', //缴费成功通知
    appointmentCancelNotice: 'xgLAuMIj9j3cwdQgXwP1pkqcT8x-1zdQJkPuANldTNs',//挂号取消通知
    refundNotice: 'M4cApW9lvGY3Yj55WgkDSefmdhfDkHzRpfP0YRSUZcg',//退费通知
    bindCardNotice: 'z4KezFBN3xAAefxdj2bEerpYBaIuuKFwpaKbI_o721k',//绑卡成功提醒
  },
  paymentOrderPage: {
    tackingMedicineGuide: true
  },
  yibao2:{
    enable: true,
    path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=440108&channel=AAEU6mLvU996Qbbdes2YGUyz&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxscd12B4Dw4uCZ1AggyeinA&orgCodg=H44010300351&orgAppId=1GUHLD8UT0KK3F60C80A000002375CD7',
    appId: 'wxe183cd55df4b4369',
    envVersion: 'trial',
    orgChnlCrtfCodg: 'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxscd12B4Dw4uCZ1AggyeinA',//  机构渠道认证编码
    orgCodg: 'H44010300351', //定点医药机构编码 
    bizType: '04107', //线上核验业务类型编码 
    orgAppId: '1GUHLD8UT0KK3F60C80A000002375CD7', // 定点医药机构应用ID 
    cityCode: '440108', //城市编码
    channel: 'AAEU6mLvU996Qbbdes2YGUyz' //渠道号（微信医保平台分配）
  }
}
const mergedConfig = mergeRecursive(DefaultConfig, config)
export default mergedConfig