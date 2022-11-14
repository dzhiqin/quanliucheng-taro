import * as React from 'react'
import { View } from '@tarojs/components'
import './notice.less'

export default function PreRegNotice() {
  return (
    <View style='padding: 0 40rpx 40rpx'>
      <View className='title'>温馨提示：</View>
      <View className='text'>
        1.<text>自2022年11月9日起，除急危重症孕产妇及其他急危重症患者等特殊人员外，进入我院人员须持24小时内核酸阴性结果；</text>
      </View>
      <View className='text'>
        2.<text>因承担疫情防控紧急任务，可能存在出诊医生临时停诊情况，请您留意我院相关通知或查看医院服务号出诊安排。</text>
        <text>感谢您的理解与支持</text>
      </View>
      <View className='text'>
        3.<text className='red-text'>发热患者、健康码为红码或黄码患者或有流行病学史的患者</text>
        <text>请直接联系预检分诊处医护人员。</text>
      </View>
      {/* <view className='text'>2.
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
      </view> */}
      <View className='title'>预约挂号说明：</View>
      <view className='text'>1.预约需要绑定电子健康卡;</view>
        <view className='text'>2.预约成功后请在就诊当日的预约时间段前30分钟在院内在任一
        <text className='red-text'>自助机进行自助报到</text>或在
        <text className='red-text'>医院微信公众号</text>的【就医服务】--【候诊服务】--【自助报到】，并及时就诊;</view>
        <view className='text'>3.<text className='red-text'>取消预约</text>:于前一日23:30分前进入微信公众号，在预约挂号成功通知消息内【取消预约】。</view>
        <view className='text'>4.当日退号:未提前取消预约市民请在预约时段内至
        <text className='red-text'>窗口办理，过时不退</text>
      </view>
      <view className='text'>5.一个月内累计取消预约达三次者该账号限制2个月不得使用预约功能;</view>
      <view className='text'>6.特需门诊诊查费不享受医保待遇。最终解释权归医院</view>
    </View>
  )
}