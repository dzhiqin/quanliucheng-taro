import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image  } from '@tarojs/components'
import { getEpidemiologicalSurveyAnswers } from '@/service/api'
import { useState } from 'react'
import BkTitle from '@/components/bk-title/bk-title'
import './epidemiological-survey.less'
import { humanDate, humanDateAndTime } from '@/utils/format'
import { QUES_TYPE } from './enums'
import { AtList, AtListItem } from "taro-ui"

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
  const [surveyState,setSurveyState] = useState(null)
  const [symptoms,setSymptoms] = useState([])
  const [hideInfo,setHideInfo] = useState(true)
  
  Taro.useDidShow(() => {
    getEpidemiologicalSurveyAnswers({questionnaireReportId: Number(id)}).then(res => {
      console.log(res);
      if(res.resultCode === 0){
        setBasicInfo(res.data.basic)
        setCreatedAt(res.data.createdTime)
        setQrCode(res.data.qrCode)
        const list = res.data.questionnaireSubjectList
        setQuestions(list)
        getSurveyStateByList(list)
      }      
    })
  })
  React.useEffect(() => {
    if(createdAt){
      const validDate = new Date(createdAt).getTime() + ONE_DAY_IN_MILLI_SECS * 6
      setInvalidAt(humanDate(new Date(validDate)) + ' 23:59:59')
    }
  },[createdAt])
  const getSurveyStateByList = (list) => {
    if(!list || list.length === 0) return
    setSymptoms(['发热','干咳'])
    setSurveyState('green')
  }
  const handleSwitchChange = (e) => {
    // console.log(e.detail.value);
    setHideInfo(e.detail.value)
  }
  return(
    <View className='survey-result'>
      <View className={`${surveyState === 'green' ? 'green-bg' : 'danger-bg'}`}>
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
          <View className='result-header-item'>有效时间{invalidAt}前</View>
        }
        {
          qrCode &&
          <View className='result-header-item result-header-image'>
            <Image src={`data:image/jpg;base64,${qrCode}`} className='result-header-qrcode' />
          </View>
        }
      </View>
      {
        symptoms.length > 0 &&
        <View className='flex survey-result-symptoms'>
          <View style='word-break: keep-all;'>症状:</View>
          <View className='flex'>
            {
              symptoms.map((symptom,index) => 
                <View className='survey-result-symptom' key={index}>{symptom}</View>
              )
            }
          </View>
        </View>
      }
      <View className='divider'></View>
      <AtList>
        <AtListItem
          title={hideInfo ? '收起明细' : '查看明细'}
          isSwitch
          onSwitchChange={handleSwitchChange}
        />
      </AtList>
      <View className='divider'></View>

      <View style='padding: 0 40rpx 40rpx'>
        <BkTitle title='基本信息' />
        {
          basicInfo && hideInfo &&
          <View className='basic-info'>
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
        
        <BkTitle title='病情概况(请根据您的情况如实填写)' />
        {
          hideInfo && questions && questions.length > 0 &&
          <View>
            {
              questions.map((ques,index) => 
                <View key={ques.id}>
                  
                  {
                    ques.subjectTypeName === QUES_TYPE.FILL_BLANK &&
                    <View>
                      <text>{ques.title}</text>
                      <text>{ques.answer}</text>
                    </View>
                  }
                  {
                    ques.subjectTypeName === QUES_TYPE.SINGLE_CHOICE &&
                    <View>
                      <View>{ques.title}</View>
                      {
                        ques.subOptions.map((subOption,subIndex) => 
                          <View key={subIndex}>
                            
                            <View className={`check-button ${ques.answer === subOption.key ? 'check-button-active' : 'check-button-unactive'}`}>{subOption.value}</View>
                          </View>
                        )
                      }
                    </View>
                  }
                </View>
              )
            }
          </View>
        }
      </View>
    </View>
  )
}