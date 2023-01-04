
import imgUrl from '@/utils/imgs'
import { REPORT_ITEM_TYPE_CN } from '@/enums/index'
import { mergeRecursive } from '@/utils/tools'
import DefaultConfig from './default'

const config = {
  latitude: 22.188096,
  longitude: 112.349162,
  hospName: "g1yy",
  hospitalName: "广州医科大学附属第一医院",
  baseUrl: "https://gyfyy-zfb.wedoublecare.com",
  logo: 'https://bkyz-applets-1252354869.cos.ap-guangzhou.myqcloud.com/common/guang1.jpeg',
  indexPage: {
    quickEntrance: {
      enable: true,
      tabList: [
        {
          title: "其他",
          entrances:[
            // {
            //   name: "自助核酸缴费",
            //   icon: imgUrl.new_home_icon10,
            //   event: "toAcidSelfPayment"
            // },
            {
              name: "蚂蚁授权",
              icon: imgUrl.new_home_icon10,
              event: "auth",
              scope: 'mfrstre'
            },
            // {
            //   name: "消息订阅",
            //   icon: imgUrl.new_home_icon10,
            //   event: "subscribe",
            //   tempId: 'e54a3ccf52c24be29ceade4123a803ad,20997d0c2cba48b48dfb217a0f77408d'
            // },
            // {
            //   name: "退诊提醒",
            //   icon: imgUrl.new_home_icon10,
            //   event: "subscribe",
            //   tempId: '20997d0c2cba48b48dfb217a0f77408d'
            // },
            // {
            //   name: "缴费成功通知",
            //   icon: imgUrl.new_home_icon10,
            //   event: "subscribe",
            //   tempId: '7cdcc8528ce443d795ae20eb8ad0ad43'
            // },
            // {
            //   name: "缴费失败提醒",
            //   icon: imgUrl.new_home_icon10,
            //   event: "subscribe",
            //   tempId: 'd765d8cd77694bc39694787780be185e'
            // },
            // {
            //   name: "绑卡成功提醒",
            //   icon: imgUrl.new_home_icon10,
            //   event: "subscribe",
            //   tempId: 'da0d433aca304bf1b51cb5a7db18a744'
            // }
          ]
        }
      ]
    }
  },
  feat: {
    greenTree: true,
    guangHuaMonitor: true
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
    pendingPayReminder: 'a08e5467b1a647aa9e2e4dcbac23d56f', // 缴费提醒 once
    visitReminder: '1fa3df2fd6d04ec387c8142aaf6a40c4', // 就诊提醒 once
    visitCancelReminder: '20997d0c2cba48b48dfb217a0f77408d', // 订单退诊提醒 once
    paySuccessNotice: '7cdcc8528ce443d795ae20eb8ad0ad43', // 缴费成功通知 once
    orderCancelNotice: 'e54a3ccf52c24be29ceade4123a803ad', // 订单取消通知 once
    bindCardNotice: 'da0d433aca304bf1b51cb5a7db18a744', // 绑卡成功通知 once
    visitProgressReminder: 'b4a62590bd96472cbcb9f5730d5fb022', // 问诊进度提醒 longterm
   }
}
const mergedConfig = mergeRecursive(DefaultConfig,config)
export default mergedConfig