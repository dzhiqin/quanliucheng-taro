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
  const [hideInfo,setHideInfo] = useState(false)
  
  Taro.useDidShow(() => {
    getEpidemiologicalSurveyAnswers({questionnaireReportId: Number(id)}).then(res => {
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
    console.log('list',list);
    const isSick = list[0].answer === '1'
    let _symptoms = []
    if(isSick){
      const symptomlist = list[0].subOptions[1].subs[0].subOptions
      const symptomValueArray = list[0].subOptions[1].subs[0].answer.split(',')
      symptomlist.forEach(item => {
        if(symptomValueArray.includes(item.key)){
          _symptoms.push(item.value)
        }
      })
      setSymptoms(_symptoms)
    }else{
      setSymptoms(['无'])
    }

    setSurveyState(isSick ? 'danger' : 'green')
  }
  const handleSwitchChange = (e) => {
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
          <View className='result-header-item'>填表时间{humanDate(new Date(createdAt)) }</View>
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
          title={hideInfo ? '查看明细' : '收起明细'}
          isSwitch
          onSwitchChange={handleSwitchChange}
        />
      </AtList>
      <View className='divider'></View>

      <View style='padding: 0 40rpx 40rpx'>
        <BkTitle title='基本信息' />
        {
          basicInfo && !hideInfo &&
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
          !hideInfo && questions && questions.length > 0 &&
          <View>
            {
              questions.map((ques,index) => 
                <View key={ques.id} className='result-ques-item' style='padding: 20rpx 0 ; border-bottom: 1rpx solid #dbdbdb'>
                  
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
                            
                            <View className={`check-button ${ques.answer === subOption.key ? 'check-button-active' : 'check-button-unactive'}`} style='margin: 10rpx'>
                              {subOption.value}
                            </View>
                            {
                                ques.answer === subOption.key && subOption.subs && subOption.subs.length > 0 && 
                                <View>
                                  {
                                    subOption.subs.map((subOptionSub) => 
                                      <View key={subOptionSub.id}>
                                        {
                                          subOptionSub.subjectTypeName === QUES_TYPE.FILL_BLANK &&
                                          <View>
                                            <text>{subOptionSub.title}</text>
                                            <text>{subOptionSub.answer}</text>
                                          </View>
                                        }
                                        {
                                          subOptionSub.subjectTypeName === QUES_TYPE.SINGLE_CHOICE &&
                                          <View>
                                            {
                                              subOptionSub.subOptions.map((grandSubOption) => {
                                                if(grandSubOption.key === subOptionSub.answer){
                                                  return (
                                                    <View>
                                                      <View className='check-button check-button-active' style='margin-left: 20rpx'>{grandSubOption.value}</View>
                                                      {
                                                        grandSubOption.subs && 
                                                        grandSubOption.subs.map(grandSubOptionSub => {
                                                          if(grandSubOptionSub.subjectTypeName === QUES_TYPE.FILL_BLANK){
                                                            return(
                                                              <View>
                                                                <text>{grandSubOptionSub.title}</text>
                                                                <text>{grandSubOptionSub.answer}</text>
                                                              </View>
                                                            )
                                                          }
                                                        })
                                                      }
                                                    </View>
                                                  )
                                                }
                                              })
                                            }
                                          </View>
                                        }
                                        {
                                          subOptionSub.subjectTypeName === QUES_TYPE.MULTI_CHOICE &&
                                          <View>
                                            {
                                              symptoms.map((symptom,symptomindex) => 
                                                <View className='check-button check-button-active' key={symptomindex} style='margin-left: 20rpx'>{symptom}</View>
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