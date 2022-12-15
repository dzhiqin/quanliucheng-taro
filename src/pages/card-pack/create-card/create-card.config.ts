export default {
  navigationBarTitleText: '创建/绑定就诊卡',
  usingComponents: {
    "ocr-scan": process.env.TARO_ENV === 'weapp' ? "../components/ocr-scan/ocr-scan" : "../components/ocr-scan-alipay/ocr-scan-alipay"
  }
}
