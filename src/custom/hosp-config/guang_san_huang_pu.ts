import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 23.207584,
  longitude: 113.492214,
  hospName: "gysyhp",
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png',
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220309-basic/gysy.png",
  hospitalName: "广州医科大学附属第三医院黄埔院区",
  // baseUrl: "https://applets.gdbkyz.com", // 倍康测试
  baseUrl: "https://gysy-applets.wedoublecare.com",// 正式环境 43.139.42.75:30091
  // baseUrl: "http://43.139.42.75:30091", // 测试
  // baseUrl: "http://192.168.4.83:5002",
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 附加功能环境
  indexPage: {
    quickEntrance: {
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
            
          ]
        }
      ]
    }
  },
  feat:{
    YiBaoCard: false, // 医保卡
    register: {
      cancelReservedTime: 0, // 取消挂号预留时间，默认2小时
      popupNotice: true,// 挂号提示弹窗
      intradayAndAppointment: false,// 是否区分当天挂号和预约挂号
      type: 'byDept',// byDept按科室挂号；byDeptAndTime按科室和时间挂号；byCategoryAndDoctorAndTime按分类、医生、日期挂号
      departmentLevel: '2', // 2级科室
      checkEpiLogicalSurvey: false, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: false,  // 院内导航
    ZhuYuanCardName: false, // 住院绑卡是否需要姓名
    arrivalService: {
      arrival: true,
      waitingList: false
    }
  },
  reportsPage:{
    hideInHosp: true, // 隐藏住院报告入口
    urlDetail: false, // 报告详情页用图片展示
    clinicReportTabs: [
      {title: '检验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查},
    ],
    hospReportTabs: [
      {title: '检验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '检查', value: REPORT_ITEM_TYPE_CN.检查},
    ]
  },
  longtermSubscribe: {
    checkReminder: 'k122ACPjHdkS6ZSo3fuYpj1bmSiQtHm2J3k3eyXTONU', // 审方提醒
    pendingPayReminder: 'KeFqSb4P0naN2T8j6J5K0fQgL6MojhynSiVPrCZixoA',// 待缴费提醒
    visitReminder: 'Xn1tFWS0H10H_RQv3tvURNceOzsFnXqd7-3zn04nESs' // 就诊提醒
  },
  onetimeSubscribe: {
    closeNotice: 'hlu656EOP1oDyNJIYiomnwiUXSeWYX9EU71FXW9IQ5M',// 医生停诊通知
    satisfactionSurveyNotice: 'thZs1UAUNAEO4H9xmyuTOg7fd9ZzjlRQCCg706kQGCk',// 患者满意度调查提醒
    appointmentNotice: 'lMk0FYfb_9Ab0h4OgQ4vMFzre19DvBJeNB4RY_CWQvA', //挂号成功通知
    paySuccessNotice: 'isQ25COANNHUoeapnheDkG_A0BP_meM2VVz1g7haT6U', //缴费成功通知
    appointmentCancelNotice: 'wh0LadWFSyzjo_u292XgUU66KieDEMR_H-CLQ65Ir54',//挂号取消通知
    refundNotice: 'gDVRne-Bq2dHWrxfeR_63xRA_c-eRhcws1_Cd_r43_4',//退费通知
    bindCardNotice: 'XdXvsxVVjBeXvGKDkN0sb4_IUKmz5-M9vVo5VvJQA30',//绑卡成功提醒
  }
}
const mergedConfig = mergeRecursive(DefaultConfig,config)
export default mergedConfig
