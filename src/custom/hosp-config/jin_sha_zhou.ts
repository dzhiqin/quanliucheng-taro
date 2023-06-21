import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 23.160986,
  longitude: 113.206014,
  hospName: "jszyy",
  isPrivate: true,
  region: ['广东省','广州市','白云区'],
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/jinshazhou-banner.png',
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/jszyy.png",
  hospitalName: "广州中医药大学金沙洲医院",
  baseUrl: "http://119.29.97.234:30082", // 医保测试环境
  // baseUrl: "https://jszyy-applets.wedoublecare.com",  // 正式环境
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  indexPage: {
    quickEntrance: {
      enable: true,
      tabList: [
        {
          title: '门诊',
          entrances: [
            {
              icon: imgUrl.zybk,
              name: '免密授权',
              event: 'click',
            }, 
            // {
            //   icon: imgUrl.new_home_icon6,
            //   name: '报到候诊',
            //   event: 'navigate',
            //   url: '/pages/service-pack/arrival-service/arrival-service'
            // }, 
            {
              icon: imgUrl.new_home_icon10,
              name: '挂号充值',
              event: 'navigate',
              url: '/pages/service-pack/deposit/deposit'
            }, 
            {
              icon: imgUrl.new_home_icon9,
              name: '健康申报',
              event: 'jump',
              appId: 'wx42f62e0e1c6d9ff0',
              path: 'subpackages/hz_xier_yss/pages/jksbk/index'
            },
            {
              icon: imgUrl.new_home_icon7,
              name: '电子诊疗卡',
              event: 'navigate',
              url: '/pages/card-pack/cards-list/cards-list'
            }
          ]
        },
        {
          title: '住院',
          entrances: [
            {
              icon: imgUrl.new_home_icon9,
              name: '住院登记',
              event: 'navigate',
              url: '/pages/hosp-pack/inpatient-notices/inpatient-notices',
            }, 
            // {
            //   icon: imgUrl.zybk,
            //   name: '住院绑卡',
            //   event: 'navigate',
            // }, 
            // {
            //   icon: imgUrl.new_home_icon10,
            //   name: '住院押金',
            //   event: 'navigate',
            //   url: '/pages/hosp-pack/deposit/deposit'
            // }, 
            {
              icon: imgUrl.new_home_icon11,
              name: '每日清单',
              event: 'navigate',
              url: '/pages/hosp-pack/checklist/checklist',
            }
          ]
        }
      ]
    },
  },
  feat:{
    hc_title: '广州市卫生健康委员会',
    bindCard: {
      rebind: true,
      elecHealthCard: false,
      oneClickAuth: false,    // 一键授权，直接绑定健康卡
      updateNotice: false, // 绑卡和解绑发送消息通知
    },
    YiBaoCard: true, // 医保卡
    register: {
      cancelReservedTime: 0, // 取消挂号预留时间
      popupNotice: true,// 挂号提示弹窗
      intradayAndAppointment: false,// 是否区分当天挂号和预约挂号
      type: 'byDept',// byDept-按科室挂号；byDeptAndTime-按科室和时间挂号；byCategoryAndDoctorAndTime-按分类、医生、日期挂号
      departmentLevel: '2', // 2级科室
      checkEpiLogicalSurvey: false, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: true,  // 院内导航
    inHospCard: true,
    arrivalService: {
      arrival: true,
      waitingList: true
    }
  },
  reportsPage:{
    hideInHosp: false, // 隐藏住院报告入口
    showImageDetail: false, // 图片展示检验报告详情
    clinicReportTabs: [
      {title: '检验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查},
    ],
    hospReportTabs: [
      {title: '检验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查},
    ],
  },
  subscribes: {
    checkReminder: '', // 审方提醒
    pendingPayReminder: '',// 待缴费提醒
    visitReminder: '', // 就诊提醒
    closeNotice: '',// 医生停诊通知
    satisfactionSurveyNotice: '',// 患者满意度调查提醒
    appointmentNotice: '', //挂号成功通知
    paySuccessNotice: '', //缴费成功通知
    appointmentCancelNotice: '',//挂号取消通知
    refundNotice: '',//退费通知
    bindCardNotice: '',//绑卡成功提醒
  },
  yibaoParams: {
    path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=440108&channel=AAGx8JTn8nVQxHkPp2rpCOLZ&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxsNta9ZJYODCgmT5ajL0Ke9&orgCodg=H44011100745&orgAppId=1GQQ6P3I81GQ3F60C80A0000A17BE977',
    appId: 'wxe183cd55df4b4369',
    envVersion: 'trial',
    orgChnlCrtfCodg: 'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxsNta9ZJYODCgmT5ajL0Ke9',//  机构渠道认证编码
    orgCodg: 'H44011100745', //定点医药机构编码 
    bizType: '04107', //线上核验业务类型编码 
    orgAppId: '1GQQ6P3I81GQ3F60C80A0000A17BE977', // 定点医药机构应用ID 
    cityCode: '440108', //城市编码
    channel: 'AAGx8JTn8nVQxHkPp2rpCOLZ' //渠道号（微信医保平台分配）
  }
}
const mergedConfig = mergeRecursive(DefaultConfig,config)
export default mergedConfig