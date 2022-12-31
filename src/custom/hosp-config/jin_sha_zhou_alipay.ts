import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 23.160986,
  longitude: 113.206014,
  hospName: "jszyy",
  isPrivate: true,
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/jinshazhou-banner.png',
  logo: "http://www.jsz120.com/uploads/allimg/200512/2-200512092512328.jpg",
  hospitalName: "广州中医药大学金沙洲医院",
  // baseUrl: "https://applets.gdbkyz.com", // 倍康测试
  baseUrl: "https://jszyy-applets.wedoublecare.com",  // 正式环境
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  indexPage: {
    quickEntrance: {
      enable: true,
      tabList: [
        {
          title: '门诊',
          entrances: [
            {
              icon: imgUrl.new_home_icon6,
              name: '登陆授权',
              event: 'auth',
              scope: ''
            }, 
            
          ]
        },
        
      ]
    },
  },
  feat:{
    bindCard: {
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
    ZhuYuanCardName: false, // 住院绑卡是否需要姓名
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
}
const mergedConfig = mergeRecursive(DefaultConfig,config)
export default mergedConfig