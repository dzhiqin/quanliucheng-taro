import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'

export default {
  latitude: 23.207584,
  longitude: 113.492214,
  hospName: "gysyhp",
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png',
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220309-basic/gysy.png",
  hospitalName: "黄埔院区线上诊疗",
  // baseUrl: "https://applets.gdbkyz.com", // 倍康测试
  baseUrl: "http://43.139.42.75:30091",  // 正式环境
  // subUrl: 'https://gysycustomize.wedoublecare.com', // 测试环境
  indexPage: {
    banner: {
      enable: true,
      url: imgUrl.banner
    },
    healthCard: {
      enable: true
    },
    navCard:{
      enable: false
    },
    functionBox:{
      enable: true,
      list: [
        {
          icon: imgUrl.new_home_icon3,
          title: '预约挂号',
          event: 'register',
          desc: '专家名医提前约'
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
          url: '/pages/reports-pack/reports-type/reports-type'
        }
      ]
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
            // {
            //   icon: imgUrl.new_home_icon7,
            //   name: '检查预约',
            //   event: 'navigate',
            // }, 
            // {
            //   icon: imgUrl.new_home_icon8,
            //   name: '满意度调查',
            //   event: 'navigate',
            // }
          ]
        },
        {
          title: '住院',
          entrances: [
            // {
            //   icon: imgUrl.new_home_icon9,
            //   name: '住院登记',
            //   event: 'navigate',
            // }, 
            // {
            //   icon: imgUrl.zybk,
            //   name: '住院绑卡',
            //   event: 'navigate',
            // }, 
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
            // {
            //   icon: imgUrl.cyjs,
            //   name: '出院结算',
            //   event: 'navigate',
            // },
            // {
            //   icon: imgUrl.bafy,
            //   name: '病案复印',
            //   event: 'toMiniProgram',
            // }
          ]
        },
        // {
        //   title: "其他",
        //   entrances:[
        //     {
        //       name: "自助核酸缴费",
        //       icon: imgUrl.new_home_icon10,
        //       event: "jump"
        //     },
        //   ]
        // }
      ]
    },
    hospBlog: {
      enable: false
    }
  },
  feat:{
    bindCard: {
      elecHealthCard: true, // 电子健康卡
      parentInfo: false,     // 监护人信息(儿童无证件)
      nationality: true,    // 国籍
      hasCard: true,  // 是否有院内就诊卡
      maritalStatus: true, // 婚姻状况
      oneClickAuth: true,    // 一键授权，直接绑定健康卡
      bindYiBaoCard: true, // 绑定医保卡
      updateNotice: false, // 绑卡和解绑发送消息通知
    },
    register: {
      cancelReservedTime: 3600 * 1000 * 2, // 取消挂号预留时间，默认2小时
      popupNotice: false,// 挂号提示弹窗
      intradayAndAppointment: true,// 是否区分当天挂号和预约挂号
      type: 'byCategoryAndDoctorAndTime',// byDept按科室挂号；byDeptAndTime按科室和时间挂号；byCategoryAndDoctorAndTime按分类、医生、日期挂号
      departmentLevel: '2', // 2级科室
      checkEpiLogicalSurvey: true, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: true,  // 院内导航
    ZhuYuanCardName: false, // 住院绑卡是否需要姓名
  },
  reportsPage:{
    urlDetail: true, // 报告详情页用图片展示
    clinicReportTabs: [
      {title: '化验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '放射', value: REPORT_ITEM_TYPE_CN.放射},
      {title: '超声', value: REPORT_ITEM_TYPE_CN.超声},
      {title: '病理', value: REPORT_ITEM_TYPE_CN.病理},
      {title: '内镜', value: REPORT_ITEM_TYPE_CN.内镜},
      {title: '产前', value: REPORT_ITEM_TYPE_CN.产前超声},
    ],
    hospReportTabs: [
      {title: '化验', value: REPORT_ITEM_TYPE_CN.化验},
      {title: '放射', value: REPORT_ITEM_TYPE_CN.放射},
      {title: '超声', value: REPORT_ITEM_TYPE_CN.超声},
      {title: '病理', value: REPORT_ITEM_TYPE_CN.病理},
      {title: '内镜', value: REPORT_ITEM_TYPE_CN.内镜},
      {title: '产前', value: REPORT_ITEM_TYPE_CN.产前超声},
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