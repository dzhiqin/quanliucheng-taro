import imgUrl from '@/utils/imgs'

export default {
  hospName: "epfy",
  hospitalName: "恩平市妇幼保健院",
  baseUrl: "https://epsfy.joyfulboo.com/api",
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220308-basic/epfy.png",
  // baseUrl: "https://applets.gdbkyz.com/api/applet",
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
          event: 'toRegister',
          desc: '专家名医提前约'
        },
        {
          icon: imgUrl.new_home_icon4,
          title: '就诊缴费',
          event: 'toPayCost',
          desc: '线上缴费免排队'
        },
        {
          icon: imgUrl.new_home_icon5,
          title: '查看报告',
          event: 'toCheckList',
          desc: '检查检验随时查'
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
      parentInfo: true,// 监护人信息(儿童无证件)
      nationality: false,
      hospitalCard: false,// 是否有院内就诊卡
      maritalStatus: false,// 婚姻状况
      oneClickAuth: false,    // 一键授权，直接绑定健康卡
      bindYiBaoCard: false, // 绑定医保卡
    },
    register: {
      bookingAndIntraday:false,// 是否区分当天挂号和预约挂号
      popupNotice: true,// 挂号提示弹窗
      guangSanMode: false,// 广三挂号模式：区分当天挂号和预约挂号
      type: 'embed',// 科室内容排版方式
    },
    hospitalNavigation: false  // 院内导航
  },
  reportsPage:{
    urlDetail: false // 报告详情页用图片展示
  }
}