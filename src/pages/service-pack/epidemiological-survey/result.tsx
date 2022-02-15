import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image  } from '@tarojs/components'
import { getEpidemiologicalSurveyAnswers } from '@/service/api'
import { useState } from 'react'
import BkTitle from '@/components/bk-title/bk-title'
import { AtList, AtListItem } from "taro-ui"
import './epidemiological-survey.less'
import { humanDate, humanDateAndTime } from '@/utils/format'

const ONE_DAY_IN_MILLI_SECS = 60 * 60 * 24 * 1000
export default function Result() {
  const router = Taro.useRouter()
  const params = router.params
  const id = params.id
  const [basicInfo,setBasicInfo] = useState(null)
  const [createdAt,setCreatedAt] = useState(null)
  const [invalidAt,setInvalidAt] = useState(null)
  const [qrCode,setQrCode] = useState(null)
  const [questions,setQuestions] = useState([])
  Taro.useDidShow(() => {
    getEpidemiologicalSurveyAnswers({questionnaireReportId: Number(id)}).then(res => {
      console.log(res);
      if(res.resultCode === 0){
        setBasicInfo(res.data.basic)
        setCreatedAt(res.data.createdTime)
        setQrCode(res.data.qrcode)
        setQuestions(res.data.questionnaireSubjectList)
      }      
    })
  })
  React.useEffect(() => {
    if(createdAt){
      const validDate = new Date(createdAt).getTime() + ONE_DAY_IN_MILLI_SECS * 6
      console.log('validDate',);
      setInvalidAt(humanDate(new Date(validDate)) + ' 23:59:59')
    }
  },[createdAt])
  return(
    <View className='survey-result'>
      {
        basicInfo &&
        <View className='result-header-item'>
          {basicInfo.patientName}
        </View>
      }
      {
        createdAt &&
        <View className='result-header-item'>填表时间{humanDateAndTime(new Date(createdAt)) }</View>
      }
      {
        invalidAt &&
        <View className='result-header-item'>有效时间{invalidAt}</View>
      }
      {
        qrCode &&
        <View className='result-header-item'>
          <Image src={`data:image/jpg;base64,${qrCode}`} className='result-header-qrcode' />
        </View>
      }
      <BkTitle title='基本信息' />
      {
        basicInfo && 
        <View className='basic-info'>
          {/* <AtList>
            <AtListItem title='卡号' />
            <AtListItem title='身份证号' />
            <AtListItem title='年龄' />
            <AtListItem title='联系电话' extraText='详细信息' />
            <AtListItem title='联系地址' disabled extraText='详细信息' />
          </AtList> */}
          <View className='basic-info-item'>
            <View className='basic-info-item-title'>姓名</View>
            <View className='basic-info-item-value'>{basicInfo.patientName}</View>
          </View>
          <View className='basic-info-item'>
            <View className='basic-info-item-title'>卡号</View>
            <View className='basic-info-item-value'>{basicInfo.cardNo}</View>
          </View>
          <View className='basic-info-item'>
            <View className='basic-info-item-title'>身份证号</View>
            <View className='basic-info-item-value'>{basicInfo.idenNo}</View>
          </View>
          <View className='basic-info-item'>
            <View className='basic-info-item-title'>年龄</View>
            <View className='basic-info-item-value'>{basicInfo.age}</View>
          </View>
          <View className='basic-info-item'>
            <View className='basic-info-item-title'>联系电话</View>
            <View className='basic-info-item-value'>{basicInfo.mobile}</View>
          </View>
          <View className='basic-info-item'>
            <View className='basic-info-item-title'>联系地址</View>
            <View className='basic-info-item-value'>{basicInfo.fullAddress}</View>
          </View>
        </View>
      }
    </View>
  )
}