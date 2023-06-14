import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { getSurvey, submitSurvey } from '@/service/api';
import { View } from '@tarojs/components'
import { useState } from 'react';
import BkLoading from '@/components/bk-loading/bk-loading';
import { modalService } from '@/service/toast-service';
import { mockData } from './mock-data';

export default function Survey(){
  const router = Taro.useRouter()
  const params = router.params
  console.log('params',params);
  const [surveyId,setSurveyId] = useState('')
  const [questions,setQuestions] = useState([])
  const [surveyTitle,setSurveyTitle] = useState('')
  const [busy,setBusy] = useState(false)
  React.useEffect(() => {
    setBusy(true)
    setQuestions(mockData.data.questionnaireSubjectList)
    getSurvey().then(res => {
      setBusy(false)
      console.log(res);
      if(res.resultCode === 0){
        const { questionnaireId, questionnaireSubjectList, questionnaireTitle } = res.data
        setSurveyId(questionnaireId)
        setQuestions(questionnaireSubjectList)
        setSurveyTitle(questionnaireTitle)
      }else{
        modalService({content: res.message})
      }
    })
  },[])
  const QuestionContent = (question) => {
    if(question.subjectType === '单选题'){
      return <SingleChoiceQues subject={question} />
    }
    if(question.subjectType === '多选题'){
      return <MultipleChoiceQues />
    }
    if(question.subjectType === '填空题'){
      return <CompletationTest />
    }
  }
  const SingleChoiceQues = (subject) => {
    return subject.title
  }
  const MultipleChoiceQues = (subject) => {
    return subject.title
  }
  const CompletationTest = (subject) => {
    return subject.title
  }
  if(busy){
    return <BkLoading />
  }else{
    return (
      <View className='survey'>
        {
          surveyTitle && 
          <View className='survey-title'>{surveyTitle}</View>
        }
        <View className='survey-content'>
          {
            questions.map((question,index) => <QuestionContent key={index} subject={question} />)
          }
        </View>
      </View>
    )
  }
  
}