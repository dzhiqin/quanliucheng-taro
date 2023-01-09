import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { 
  getEpidemiologicalSurveyInfo, 
  getEpidemiologicalSurveyQuestions,
  handleSubmitEpidemiologicalSurvey
 } from '@/service/api';
import { View } from '@tarojs/components'
import { useState } from 'react';
import { loadingService, modalService, toastService } from '@/service/toast-service';
import { AtInput,AtCheckbox } from 'taro-ui';
import BkTitle from '@/components/bk-title/bk-title';
import QuestionItem from './question-item';
import BkButton from '@/components/bk-button/bk-button';
import HealthCards from '@/components/health-cards/health-cards';
import { CardsHealper } from '@/utils/cards-healper';
import { QUES_TYPE } from './enums';

export default function EpidemiologicalSurvey(){
  const [surveyInfo,setSurveyInfo] = useState(null)
  const [description,setDescription] = useState('')
  const [basicInfo,setBasicInfo] = useState(null)
  const [questions,setQuestions] = useState([])
  const [busy,setBusy] = useState(false)
  const [quesId,setQuesId] = useState(null)
  const [selectedList,setSelectedList] = useState(['true'])
  Taro.useReady(() => {
    getEpidemiologicalSurveyInfo().then(res => {
      if(res.resultCode === 0){
        setSurveyInfo(res.data[0])
        setDescription(res.data[0].description)
        getEpidemiologicalSurveyQuestions({typeId: res.data[0].questionnaireTypeId}).then(data => {
          if(data.resultCode === 0){
            setBasicInfo(data.data.basic)
            setQuestions(data.data.questionnaireSubjectList)
            setQuesId(data.data.questionnaireId)
          }else{
            modalService({title: '获取流调表失败',content: data.message})
          }
        })
      }else{
        modalService({title: '获取数据失败',content: res.message})
      }
    })
  })
  Taro.useDidShow(() => {
    const card = CardsHealper.getDefault()
    if(basicInfo && card.cardNo !== basicInfo.cardNo){
      setSurveyInfo({
        idenNo: card.idenNo,
        mobile: card.cellphone,
        age: card.age,
        fullAddress: ''
      })
    }
  })
  const initAnswers = (dataList) => {
    let list = []
    dataList.forEach(item => {
      const temp = {
        id: item.id,
        answer: item.answer,
        title: item.title,
        subAnswers: undefined
      }
      if(item.subOptions && hasSubQuestion(item.subOptions)){
        const subTemp = initSubAnswers(item.subOptions,item.answer)
        temp.subAnswers = subTemp
      }
      list.push(temp)
    });
    return list
  }
  const initSubAnswers = (array,parentAnswer) => {
    let list = []
    array.forEach(item => {
      if(item.key === parentAnswer && item.subs && item.subs.length > 0){
        const temp:any = initAnswers(item.subs)
        if(hasSubQuestion(item)){
          const subList = initAnswers(item.subs)
          temp.subAnswers = subList
          list = list.concat(temp)
        }else{
          list = list.concat(temp)
        }
      }
    })
    return list
  }

  const hasSubQuestion = (list) => {
  let result = false;
  for (let i = 0; i < list.length; i++) {
    if((list[i].subOptions && list[i].subOptions.length > 0) || (list[i].subjectType && list[i].subjectType === 1) ){
        result = true
        break
    }
    if(list[i].subs){
        result = hasSubQuestion(list[i].subs)
    }
  }
  return result;
};
  const handleBasicChange = (stateName,value) => {
    if(typeof value === 'string'){
      value = value.trim()
    }    
    setBasicInfo({
      ...basicInfo,
      [stateName]: value
    })
  }
  const onCkBoxChange = (value) => {
    setSelectedList(value)
  }
  const handleSubmit = () => {
    if(selectedList[0] !== 'true'){
      toastService({title: '请勾选保证属实选项'})
      return
    }
    const buildAnswers = initAnswers(questions)
    // console.log('build answers',buildAnswers);
    let result = formValidator(buildAnswers)
    if(/其他症状/.test(result.message))
      // 特殊判断条件
      result.valid = true
    if(result.valid){
      loadingService(true)
      setBusy(true)
      handleSubmitEpidemiologicalSurvey({
        questionnaireId: quesId,
        answers: buildAnswers,
        orderNo: ''
      }).then(res => {
        if(res.resultCode === 0){
          toastService({title: '提交成功', onClose: () => {loadingService(false);Taro.navigateBack();Taro.setStorageSync('checkEpiLogicalSurvey',true)}})
        }else{
          loadingService(false)
          modalService({content: res.message})
        }
      })
    }else{
      toastService({title: result.message})
    }
  }
  const formValidator = (buildAnswers,result = {valid: true,message: ''}) => {
    for(let i =0;i< buildAnswers.length;i++){
      if(!buildAnswers[i].answer){
        result = {valid: false,message:buildAnswers[i].title}
        break
      }
      if(buildAnswers[i].subAnswers && buildAnswers[i].subAnswers.length > 0){
        result = formValidator(buildAnswers[i].subAnswers,result)
      }
    }
    return result
  }
  const handleSubQuesItemChange = dataset => {
    // console.log('handleSubQuesItemChange',dataset);
    const temp = questions.map(parentQues => {
      if(parentQues.subOptions && parentQues.subOptions.length > 0){
        const parentSubOptions = parentQues.subOptions.map(subQues => {
          if(subQues.subs && subQues.subs.length > 0){
            const subQuesSubs = subQues.subs.map(sub => {
              if(sub.subOptions && sub.subOptions.length > 0){
                const grandSubOptions = sub.subOptions.map(grandQues => {
                  if(grandQues.subs && grandQues.subs.length > 0){
                    const grandQuesSubs = grandQues.subs.map(item => {
                      if(item.id === dataset.id){
                        return {
                          ...item,
                          answer: dataset.value
                        }
                      }else{
                        return {...item}
                      }
                    })
                    return {
                      ...grandQues,
                      subs: grandQuesSubs
                    }
                  }else{
                    return {...grandQues}
                  }
                })
                if(sub.id === dataset.id){
                  sub.answer = dataset.value
                }
                return {
                  ...sub,
                  subOptions: grandSubOptions,
                }
              }else{
                if(sub.id === dataset.id){
                  return {
                    ...sub,
                    answer: dataset.value
                  }
                }else{
                  return {...sub}
                }
              }
            })
            return {
              ...subQues,
              subs: subQuesSubs
            }
          }else{
            return {...subQues}
          }
        })
        return {
          ...parentQues,
          subOptions: parentSubOptions
        }
      }else{
        return {...parentQues}
      }
    })
    // console.log('rebuild answers = ', temp)
    setQuestions(temp)
  }
  const handleQuestionItemChange = (dataset) => {
    const temp = questions.map(item => {
      if(item.id === dataset.id){
        return {
          ...item,
          answer: dataset.type === QUES_TYPE.FILL_BLANK ? dataset.value : dataset.key
        }
      }else{
        return {...item}
      }
    })
    setQuestions(temp)
  }
  return (
    <View className='survey'>
      <HealthCards switch />
      {
        surveyInfo && 
        <View style='padding: 40rpx'>
          <View className='survey-title'>{surveyInfo.title}</View>
          <View dangerouslySetInnerHTML={{__html: description}}></View>
        </View>
      }
      <BkTitle title='一、基本信息' style='margin-left: 40rpx' />
      {
        basicInfo &&
        <View style='padding: 0 40rpx'>
          <AtInput 
            editable={false}
            name='idenNo' 
            title='证件号码' 
            type='text' 
            placeholder='请输入证件号码' 
            value={basicInfo.idenNo} 
            onChange={handleBasicChange.bind(this,'idenNo')}
          ></AtInput>
          <AtInput 
            editable={false}
            name='mobile' 
            title='联系电话' 
            type='number' 
            placeholder='请输入电话号码' 
            value={basicInfo.mobile} 
            onChange={handleBasicChange.bind(this,'mobile')}
          ></AtInput>
          <AtInput 
            name='age' 
            editable={false}
            title='年龄' 
            type='number' 
            placeholder='请输入您的年龄' 
            value={basicInfo.age} 
            onChange={handleBasicChange.bind(this,'age')}
          ></AtInput>
          <AtInput 
            name='fullAddress' 
            title='联系地址' 
            editable={false}
            type='text' 
            placeholder='请输入您的地址' 
            value={basicInfo.fullAddress} 
            onChange={handleBasicChange.bind(this,'fullAddress')}
          ></AtInput>
        </View>
      }
      <BkTitle title='二、病情概况（请根据您的情况如实填写）' style='margin-left: 40rpx' />
      {
        questions.length > 0 &&
        <View style='margin: 0 40rpx;'>
          {
            questions.map((item,index) => 
              <QuestionItem 
                onChange={handleQuestionItemChange} 
                onSubChange={handleSubQuesItemChange}
                answer={item.answer} 
                id={item.id} 
                subOptions={item.subOptions} 
                subjectTypeName={item.subjectTypeName} 
                title={item.title} 
                key={index} 
              />
            )
          }
        </View>
      }
      <View className='survey-tips'>
        (注：”*“疫情中高风险地区以填写时政府部门公布为准)
      </View>
      <AtCheckbox
        options={[{value: 'true',label: '我保证以上内容属实'}]}
        selectedList={selectedList}
        onChange={onCkBoxChange.bind(this)}
      />
      <View style='padding: 40rpx'>
        <BkButton title='确认' onClick={handleSubmit} disabled={busy} />
      </View>
    </View>
  )
}