import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { getSurvey, submitSurvey } from '@/service/api';
import { View,Checkbox,CheckboxGroup } from '@tarojs/components'
import { useState,useRef } from 'react';
import BkLoading from '@/components/bk-loading/bk-loading';
import { modalService } from '@/service/toast-service';
import { AtInput } from 'taro-ui';
// import { mockData } from './mock-data';
import BkButton from '@/components/bk-button/bk-button';
import './survey.less'
import { CARD_ACTIONS } from '@/enums/index';

export default function Survey(){
  const router = Taro.useRouter()
  const params = router.params
  const [surveyId,setSurveyId] = useState('')
  const [questions,setQuestions] = useState([])
  const [surveyTitle,setSurveyTitle] = useState('')
  const [busy,setBusy] = useState(false)
  let answers = useRef([])
  const initAnswers = (quesList) => {
    const originAnswers = getFlatAnswers(quesList)
    answers.current=originAnswers
  }
  const getData = () => {
    setBusy(true)
    // begin mock data
    // setQuestions(mockData.data.questionnaireSubjectList)
    // initAnswers(mockData.data.questionnaireSubjectList)
    // setSurveyTitle(mockData.data.questionnaireTitle)
    // setBusy(false)
    // end

    getSurvey().then(res => {
      setBusy(false)
      if(res.resultCode === 0){
        const { questionnaireId, questionnaireSubjectList, questionnaireTitle } = res.data
        setSurveyId(questionnaireId)
        setQuestions(questionnaireSubjectList)
        initAnswers(questionnaireSubjectList)
        setSurveyTitle(questionnaireTitle)
      }else{
        modalService({content: res.message})
      }
    }).catch(err => {
      modalService({content: err.message})
    })
  }
  Taro.useDidShow(() => {
    if(!Taro.getStorageSync('token')){
      Taro.eventCenter.on(CARD_ACTIONS.UPDATE_ALL,() => {
        getData()
      })
    }else{
      getData()
    }
  })
  Taro.useDidHide(() => {
    Taro.eventCenter.off(CARD_ACTIONS.UPDATE_ALL)
  })
  const findSubQuestion = (subOptions) => {
    return subOptions.find(i => i.subs && i.subs.length > 0)
  }
  const getFlatAnswers = (quesList,parentId='',activeValue='') => {
    let list = []
    quesList.forEach(item => {
      list.push({id: item.id, answer: '',parentId,activeValue})
      if(item.subOptions && findSubQuestion(item.subOptions)){
        const subList = getFlatAnswers(findSubQuestion(item.subOptions).subs,item.id,findSubQuestion(item.subOptions).key)
        list = list.concat(subList)
      }
    })
    return list
  }
  // const mapIdAndAnswer = (quesList) => {
  //   let list = [] 
  //   quesList.forEach(item => {
  //     if(item.subOptions && findSubQuestion(item.subOptions)){
  //       const subAnswers = mapIdAndAnswer(findSubQuestion(item.subOptions).subs)
  //       list.push({id: item.id,answer: '',subAnswers})
  //     }else{
  //       list.push({id: item.id,answer: ''})
  //     }
  //   })
  //   return list
  // }
  const handleSingleChoiceChange = (e) => {
    const {id,answer} = e
    updateAnswers({id,answer})
  }
  const handleMultiChoiceChange = (e) => {
    const {id,answer} = e
    // 后端入参格式需求，把数组改为字符串，逗号隔开
    updateAnswers({id,answer: answer.join(',')})
  }
  const handleFillInBlankChange = (e) => {
    const {id,answer} = e
    updateAnswers({id,answer: answer})
  }
  const QuestionContent = ({question}) => {
    if(question.subjectTypeName === '单选题'){
      return <SingleChoiceQues subject={question} onChange={handleSingleChoiceChange.bind(this)} />
    }else if(question.subjectTypeName === '多选题'){
      return <MultipleChoiceQues subject={question} onChange={handleMultiChoiceChange.bind(this)} />
    }else if(question.subjectTypeName === '填空题'){
      return <FillInBlankQues subject={question} onChange={handleFillInBlankChange.bind(this)} />
    }else{
      return <View>未适配的题型</View>
    }
  }
  
  const updateAnswers = ({id, answer}) => {
    const _answers = answers.current.map(item => {
      if(item.id === id){
        return {...item,answer: answer}
      }else{
        return item
      }
    })
    answers.current = _answers
  }
  const SingleChoiceQues = ({subject,onChange}) => {
    const [selectedKey,setKey] = useState('')
    const handleChange = (e) => {
      const key = e.detail.value.pop()
      setKey(key)
      onChange({id: subject.id, answer: key})
    }
    const isChecked = (key) => {
      return key === selectedKey
    }
    return (
      <View className='survey-ques'>
        <View>{subject.title}</View>
        <CheckboxGroup onChange={handleChange.bind(this)}>
          {
            subject.subOptions.map((optionItem, index) => 
              <View key={index}>
                <Checkbox value={optionItem.key} checked={isChecked(optionItem.key)}>{optionItem.value}</Checkbox>
                {
                  optionItem.subs && optionItem.subs.length > 0 &&
                  optionItem.subs.map((subQues,subIndex) => <QuestionContent key={subIndex} question={subQues} />
                  )
                }
              </View>
            )
          }
        </CheckboxGroup>
      </View>
    )
  }
  
  const MultipleChoiceQues = ({subject,onChange}) => {
    const handleChange = (e) => {
      const key = e.detail.value
      onChange({id: subject.id, answer: key})
    }
    
    return (
      <View className='survey-ques'>
        <View>{subject.title}</View>
        <CheckboxGroup onChange={handleChange.bind(this)}>
          {
            subject.subOptions.map((optionItem, index) => 
              <View key={index}>
                <Checkbox value={optionItem.key} >{optionItem.value}</Checkbox>
                {
                  optionItem.subs && optionItem.subs.length > 0 &&
                  optionItem.subs.map((subQues,subIndex) => <QuestionContent key={subIndex} question={subQues} />
                  )
                }
              </View>
            )
          }
        </CheckboxGroup>
      </View>
    )
  }
  const FillInBlankQues = ({subject,onChange}) => {
    const handleChange = (e) => {
      const value = e
      onChange({id: subject.id, answer: value})
    }
    return (
      <View className='survey-ques'>
        <View>{subject.title}</View>
        <AtInput
          name={subject.id}
          title=''
          type='text'
          placeholder=''
          onChange={handleChange.bind(this)}
        />
      </View>
    )
  }
  const validator = () => {
    return answers.current.every(item => {
      if(item.parentId){
        const parentObj = answers.current.find(i => i.id === item.parentId)
        if(parentObj.answer.split(',').includes(item.activeValue)){
          return !!item.answer
        }else{
          return true
        }
      }else{
        return !!item.answer
      }
    })
  }
  const flatToTree = (items) => {
    const result = []
    const itemMap = {}
    // 转成json对象
    for(let item of items){
      itemMap[item.id] = {...item,subAnswers: []}
    }
    // 重组父子关系对象
    for(let item of items){
      const id = item.id
      const parentId = item.parentId
      const treeItem = itemMap[id]
      if(parentId === ''){
        result.push(treeItem)
      }else{
        if(itemMap[parentId].answer.split(',').includes(treeItem.activeValue)){
          itemMap[parentId].subAnswers.push(treeItem)
        }
      }
    }
    return result
  }

  const handleSubmit = () => {
    if(!validator()){
      modalService({content: '请填写完整再提交'})
      return
    }
    const rebuildedAnswers = flatToTree(answers.current)
    console.log(rebuildedAnswers);
    submitSurvey({
      questionnaireId: surveyId,
      orderId: Number(params.orderId),
      answers: rebuildedAnswers
    }).then(res => {
      if(res.resultCode === 0){
        modalService({content: '提交成功',success: () => {
          Taro.switchTab({url: '/pages/index/index'})
        }})
      }else{
        modalService({content: res.message,title: '提交失败'})
      }
    })
  }
  if(questions.length === 0){
    return <BkLoading loading={busy} msg='没有新的问卷' />
  }else{
    return (
      <View className='survey'>
        {
          surveyTitle && 
          <View className='survey-title'>{surveyTitle}</View>
        }
        <View className='survey-content'>
          {
            questions.map((question,index) => <QuestionContent key={index} question={question} />)
          }
        </View>
        <View style='padding: 40rpx'>
          <BkButton title='提交' onClick={handleSubmit} />
        </View>
      </View>
    )
  }
  
}