import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import {HospConfig} from '../index'

const config:HospConfig = {
  // 经纬度来源：腾讯位置服务 https://lbs.qq.com/getPoint/
  latitude: 23.122721,    // 院区维度
  longitude: 113.240994,  // 院区经度
  banner: '',
  region: ['广东省','广州市','荔湾区'],
  hospName: "gy3ylw",
  hospitalName: "广州医科大学附属第三医院",
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220308-basic/epfy.png",
  // baseUrl: "https://applets.gdbkyz.com/api/applet", // 倍康测试
  baseUrl: "https://gysy.wedoublecare.com",  // 正式环境
  subUrl: 'https://gysycustomize.wedoublecare.com', // 核酸退费
  isPrivate: false,//是否是私人医院，私人医院无法使用公立医院的订阅模板
  indexPage: { // 首页配置
    banner: { // 轮播图组件
      enable: true,
      url: imgUrl.banner
    },
    healthCard: { // 健康卡组件
      enable: true
    },
    navCard:{ // 导航卡组件
      enable: false
    },
    functionBox:{ // 功能模块组件
      enable: true,
      list: [
        {
          icon: imgUrl.new_home_icon3,
          title: '预约挂号',
          event: 'register',
          desc: '专家名医提前约',
          tag: 'green'
        },
        {
          icon: imgUrl.new_home_icon4,
          title: '就诊缴费',
          event: 'navigate',
          desc: '线上缴费免排队',
          url: '/pages/payment-pack/payment-list/payment-list'
        },
        {
          icon: imgUrl.new_home_icon5,
          title: '查看报告',
          event: 'navigate',
          desc: '检查检验随时查',
          url: '/pages/reports-pack/reports-type/reports-type',
          tag: 'green'
        }
      ]
    },
    
    quickEntrance: {  // 快捷入口组件
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
              icon: imgUrl.new_home_icon7,
              name: '检查预约',
              event: 'navigate',
            }, 
            {
              icon: imgUrl.new_home_icon8,
              name: '满意度调查',
              event: 'navigate',
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
            }, 
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
            },
            {
              icon: imgUrl.cyjs,
              name: '出院结算',
              event: 'navigate',
            },
            {
              icon: imgUrl.bafy,
              name: '病案复印',
              event: 'jump',
              appId: 'wx075e060a6f21ae66',
              path: 'pages/index/index'
            }
          ]
        },
        {
          title: "其他",
          entrances:[
            {
              name: "自助核酸缴费",
              icon: imgUrl.new_home_icon10,
              event: "jump",
              appId: '',
              path: ''
            },
            {
              name: "电子票夹",
              icon: imgUrl.new_home_icon10,
              event: "jump",
              appId: 'wx8e0b79a7f627ca18',
              path: 'pages/index/index?agencyCode=ccd5fa6bc02f4420a131d6d46e165c71'
            },
          ]
        }
      ]
    },
    hospBlog: {
      enable: false
    }
  },
  feat:{
    hc_title: '广东省卫生健康委员会',
    invoice: true, // 电子发票
    guangHuaMonitor: {
      enable: false,
      pid: '',
      miniVersion: ''
    }, // 光华监控平台
    greenTree: false,// 蚂蚁森林接入
    bindCard: { // 绑卡/建卡相关配置
      rebind: false,
      smsVerify: {
        enable: false,
        apikey: 'N68313eb24',
        secret: '683135068234a327',
        sign_id: 168951,
        template_id: 133435
      },
      elecHealthCard: true, // 是否电子健康卡
      parentInfo: true,     // 是否需要监护人信息(儿童无证件)
      nationality: true,    // 是否需要国籍
      hasCard: true,  // 是否需要判定有院内就诊卡的情况
      maritalStatus: true, // 是否需要填写婚姻状况
      oneClickAuth: true,    // 是否可以一键授权，直接绑定健康卡
      updateNotice: false, // 绑卡和解绑发送消息通知
    },
    YiBaoCard: true, // 医保卡
    register: {
      changeFeeType: false,
      cancelReservedTime: 3600 * 1000 * 2, // 取消挂号预留时间，默认2小时
      popupNotice: true,// 挂号提示弹窗
      intradayAndAppointment: false,// 是否区分当天挂号和预约挂号
      type: 'byDept',// byDept按科室挂号；byDeptAndTime按科室和时间挂号；byCategoryAndDoctorAndTime按分类、医生、日期挂号
      departmentLevel: '2', // 2级科室
      checkEpiLogicalSurvey: false, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: false,  // 院内导航
    ZhuYuanCardName: true, // 住院绑卡是否需要姓名
    inHospCard: true,
    arrivalService: {
      arrival: true,
      waitingList: true
    }
  },
  reportsPage:{
    hideInHosp: false, // 隐藏住院报告入口
    showImageDetail: true, // 图片展示检验报告详情
    clinicReportTabs: [  // 门诊报告分类
      {title: '化验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '放射', value: REPORT_ITEM_TYPE_CN.放射},
      {title: '超声', value: REPORT_ITEM_TYPE_CN.超声},
      {title: '病理', value: REPORT_ITEM_TYPE_CN.病理},
      {title: '内镜', value: REPORT_ITEM_TYPE_CN.内镜},
      {title: '产前', value: REPORT_ITEM_TYPE_CN.产前超声},
    ],
    hospReportTabs: [  // 住院报告分类
      {title: '化验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '放射', value: REPORT_ITEM_TYPE_CN.放射},
      {title: '超声', value: REPORT_ITEM_TYPE_CN.超声},
      {title: '病理', value: REPORT_ITEM_TYPE_CN.病理},
      {title: '内镜', value: REPORT_ITEM_TYPE_CN.内镜},
      {title: '产前', value: REPORT_ITEM_TYPE_CN.产前超声},
    ]
  },
  subscribes: {
    checkReminder: 'k122ACPjHdkS6ZSo3fuYpj1bmSiQtHm2J3k3eyXTONU', // 审方提醒 长期订阅
    pendingPayReminder: 'KeFqSb4P0naN2T8j6J5K0fQgL6MojhynSiVPrCZixoA',// 待缴费提醒 长期订阅
    visitReminder: 'Xn1tFWS0H10H_RQv3tvURNceOzsFnXqd7-3zn04nESs', // 就诊提醒 长期订阅
    closeNotice: 'hlu656EOP1oDyNJIYiomnwiUXSeWYX9EU71FXW9IQ5M',// 医生停诊通知
    satisfactionSurveyNotice: 'thZs1UAUNAEO4H9xmyuTOg7fd9ZzjlRQCCg706kQGCk',// 患者满意度调查提醒
    appointmentNotice: 'lMk0FYfb_9Ab0h4OgQ4vMFzre19DvBJeNB4RY_CWQvA', //挂号成功通知
    paySuccessNotice: 'isQ25COANNHUoeapnheDkG_A0BP_meM2VVz1g7haT6U', //缴费成功通知
    appointmentCancelNotice: 'wh0LadWFSyzjo_u292XgUU66KieDEMR_H-CLQ65Ir54',//挂号取消通知
    refundNotice: 'gDVRne-Bq2dHWrxfeR_63xRA_c-eRhcws1_Cd_r43_4',//退费通知
    bindCardNotice: 'XdXvsxVVjBeXvGKDkN0sb4_IUKmz5-M9vVo5VvJQA30',//绑卡成功提醒
    visitProgressReminder: '',
  },
  
  paymentOrderPage: {
    tackingMedicineGuide: true //取药指引
  },
  yibaoParams: null,
}
export default config