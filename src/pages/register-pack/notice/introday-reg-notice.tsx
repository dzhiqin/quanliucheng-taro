import * as React from 'react'
import { View } from '@tarojs/components'
import './notice.less'

export default function IntrodayRegNotice() {
  return (
    <View style='padding: 0 40rpx 40rpx'>
      <View className='title'>温馨提示：</View>
      <View className='text'>
        1.<text className='red-text'>发热患者、健康码为红码或黄码患者或有流行病学史的患者</text>
        <text>请直接联系预检分诊处医护人员。</text>
      </View>
      <view className='text'>2.
        <text>预约</text>
        <text className='red-text'>高风险侵入性操作(如胃镜，肠镜，呼吸内镜以及耳鼻喉镜等)或特殊治疗(如血液透析、肿瘤放化疗等)</text>
        <text>的患者，需有</text>
        <text className='red-text'>7日内</text>
        <text>核算检测阴性结果</text>
      </view>
      <view className='text'>3.
        <text>预约门诊手术的患者，需有</text>
        <text className='red-text'>72小时</text>
        <text>内的核算检测阴性结果</text>
      </view>
      <View className='title'>当日挂号说明：</View>
      <view className='text'>
        <view> 1.当日7:00开放挂号;</view>
        <view> 2.挂号成功后请在院内任一<text className='red-text'>自助机进行自助报到</text>或在<text
          className='red-text'
        >医院微信公众号</text>的【就医服务】--【候诊服务】--【自助报到】，并及时就诊;</view>
        <view>3.<text className='red-text'>当日退号</text>请在预约时间段前至人工窗口办理。</view>
        <view>4.特需门诊诊查费不享受医保待遇。最终解释权归医院</view>
      </view>
    </View>
  )
}