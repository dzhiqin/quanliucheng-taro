
import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 22.188096,
  longitude: 112.349162,
  hospName: "epfy",
  hospitalName: "恩平市妇幼保健院",
  baseUrl: "https://epsfy.joyfulboo.com/api",
  logo: "https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/lwgk/20220308-basic/epfy.png",
  indexPage: {
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
    }
  },
  feat: {
    register: {
      intradayAndAppointment: false,// 是否区分当天挂号和预约挂号
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
  }
}
const mergedConfig = mergeRecursive(DefaultConfig,config)
export default mergedConfig