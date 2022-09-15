import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'

export default {
  latitude: 23.122721,    // 院区维度
  longitude: 113.240994,  // 院区经度
  hospName: "gysylw",
  hospitalName: "广州医科大学附属第三医院",
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220308-basic/epfy.png",
  // baseUrl: "https://applets.gdbkyz.com/api/applet", // 倍康测试
  baseUrl: "https://gysy.wedoublecare.com",  // 正式环境
  subUrl: 'https://gysycustomize.wedoublecare.com', // 核酸退费
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
            // {
            //   icon: imgUrl.new_home_icon10,
            //   name: '住院押金',
            //   event: 'navigate',
            // }, 
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
    bindCard: { // 绑卡/建卡相关配置
      elecHealthCard: true, // 是否电子健康卡
      parentInfo: false,     // 是否需要监护人信息(儿童无证件)
      nationality: true,    // 是否需要国籍
      hasCard: true,  // 是否需要判定有院内就诊卡的情况
      maritalStatus: true, // 是否需要填写婚姻状况
      oneClickAuth: true,    // 是否可以一键授权，直接绑定健康卡
      
    },
    YiBaoCard: true, // 医保卡
    register: {
      cancelReservedTime: 3600 * 1000 * 2, // 取消挂号预留时间，默认2小时
      popupNotice: false,// 挂号提示弹窗
      intradayAndAppointment: true,// 是否区分当天挂号和预约挂号
      type: 'byDept',// byDept按科室挂号；byDeptAndTime按科室和时间挂号；byCategoryAndDoctorAndTime按分类、医生、日期挂号
      departmentLevel: '2', // 2级科室
      checkEpiLogicalSurvey: true, // 是否要先填流调表才可以挂号
    },
    hospitalNavigation: true,  // 院内导航
    ZhuYuanCardName: false, // 住院绑卡是否需要姓名
  },
  reportsPage:{
    urlDetail: true, // 报告详情页用图片展示
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
  }
}