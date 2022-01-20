import imgUrl from '@/utils/imgs'

export default {
  hospName: "lwgk",
  hospitalName: "广州市荔湾区骨伤科医院",
  baseUrl: "https://lwgk.joyfulboo.com/api",
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
          title: "其他",
          entrances:[
            {
              name: "自助核酸缴费",
              icon: imgUrl.new_home_icon10,
              event: "toAcidSelfPayment"
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
    bindCard: {
      electronicHealthCard: false, // 电子健康卡
      parentInfo: true, // 监护人信息（无证件）
      nationality: false,// 是否需要国籍
      hospitalCard: false,// 是否有院内就诊卡
      maritalStatus: false,// 是否需要婚姻状况
      oneClickAuth: false,    // 一键授权，直接绑定健康卡
      bindYiBaoCard: false, // 绑定医保卡
    },
    register: {
      bookingAndIntraday:false,// 是否区分当天挂号和预约挂号
      popupNotice: true,// 挂号提示弹窗
      guangSanMode: true,// 广三挂号模式：区分当天挂号和预约挂号
      type: 'embed',// 科室内容排版方式
    },
    hospitalNavigation: false  // 院内导航
  },
  reportsPage:{
    urlDetail: false // 报告详情页用图片展示
  }
}