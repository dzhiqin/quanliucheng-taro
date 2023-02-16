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
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/jszyy.png",
  hospitalName: "广州中医药大学金沙洲医院",
  // baseUrl: "https://applets.gdbkyz.com", // 倍康测试
  baseUrl: "https://jszyy-zfb.wedoublecare.com",  // 正式环境
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  indexPage: {
    quickEntrance: {
      enable: false,
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
    hc_title: '广州市卫生健康委员会',
    guangHuaMonitor: {
      enable: true,
      pid: 'gawxs1+8lx2b1/htdsyxjg==',
      miniVersion: '0.0.3'
    },
    bindCard: {
      elecHealthCard: false,
      oneClickAuth: false,    // 一键授权，直接绑定健康卡
      updateNotice: false, // 绑卡和解绑发送消息通知
    },
    YiBaoCard: false, // 医保卡
    register: {
      cancelReservedTime: 0, // 取消挂号预留时间
      popupNotice: true,// 挂号提示弹窗
      intradayAndAppointment: false,// 是否区分当天挂号和预约挂号
      type: 'byDept',// byDept-按科室挂号；byDeptAndTime-按科室和时间挂号；byCategoryAndDoctorAndTime-按分类、医生、日期挂号
      departmentLevel: '2', // 2级科室
      checkEpiLogicalSurvey: false, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: true,  // 院内导航
    inHospCard: false,
    arrivalService: {
      arrival: true,
      waitingList: true
    }
  },
  reportsPage:{
    hideInHosp: true, // 隐藏住院报告入口
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
    pendingPayReminder: 'a08e5467b1a647aa9e2e4dcbac23d56f', // 缴费提醒 once
    visitReminder: '45388b80155f427e91c702bd309b178b', // 就诊提醒 once
    visitCancelReminder: '96d91c3620d04c35a779525b8eadc453', // 订单退诊提醒 once
    paySuccessNotice: '78babfd34cf24325b619d936aa378b1f', // 缴费成功通知 once
    orderCancelNotice: '', // 订单取消通知 once notyet
    bindCardNotice: 'd730066b4c2a48db96d02c704b02be33', // 绑卡成功通知 once
    visitProgressReminder: '', // 问诊进度提醒 longterm notyet
  },
}
const mergedConfig = mergeRecursive(DefaultConfig,config)
export default mergedConfig