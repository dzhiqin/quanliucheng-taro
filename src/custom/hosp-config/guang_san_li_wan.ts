import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'

export default {
  latitude: 23.122721,
  longitude: 113.240994,
  hospName: "gysylw",
  banner: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/applets-imgs/banner2.png',
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220309-basic/gysy.png",
  hospitalName: "广州医科大学附属第三医院",
  // baseUrl: "https://applets.gdbkyz.com", // 倍康测试
  baseUrl: "https://gysy.wedoublecare.com",  // 正式环境
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
      updateNotice: true, // 绑卡和解绑发送消息通知
    },
    YiBaoCard: true, // 医保卡
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
    hideInHosp: false, // 隐藏住院报告入口
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
    checkReminder: 'M8e0Dbtb87M8DUXYPwTQdOxnz8sddpCkc_r7_VMd2Jc', // 审方提醒
    pendingPayReminder: 'z5DIZhdEj9DCvfKRheU06kKod6r55bx1LC8p2VsB_O4',// 待缴费提醒
    visitReminder: 'A8GTcQvlKDqEDSi1u19RFwKqRjrPJwW4feHMuvpZNso' // 就诊提醒
  },
  onetimeSubscribe: {
    closeNotice: 'AcXeVD04Z9NegbFhak1We0UI4jG_Zb8Uj3Bfvzf_8jM',// 医生停诊通知
    satisfactionSurveyNotice: 'sET4fH6WMDnX2V88JkFay_sPBaCcFtv1ax5NXicdWwA',// 患者满意度调查提醒
    appointmentNotice: 'KB2AIUyjvp209JGNy-7EtKDSK4N2fgwfpbaMazZsclA', //挂号成功通知
    paySuccessNotice: 'F5gOTB-fPJ0y5QG94_QQ0MUxaxJ0cIl1eA_NBNlQ4wk', //缴费成功通知
    appointmentCancelNotice: 'MlDidLtES5vVTC4YcGIhYluIMIXSi7hX3JXngkgUV7s',//挂号取消通知
    refundNotice: 'Hhj5lSuAslXx5VGEbhfp2KAiSw__Qv3_B3_1i16qt5o',//退费通知
    bindCardNotice: 'KDkqTgWPR8SUOnWTu-QS8LPBcTPrB121kHuHOFPcRjY',//绑卡成功提醒
  }
}