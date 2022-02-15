import * as Taro from '@tarojs/taro'
import * as React from 'react'
import {View} from '@tarojs/components'
import { AtInput } from 'taro-ui'
import './epidemiological-survey.less'
import { useState } from 'react'

const CheckButtonItem = (params:{
  onItemChange: Function,
  onSubItemChange: Function,
  option: any,
  selected: boolean
}) => {
  const { onItemChange, onSubItemChange } = params
  const onBtnItemClick = () => {
    if(typeof onItemChange === 'function'){
      onItemChange(params.option)
    }
  }
  const handleChange = (id,dataset) => {
    onSubItemChange({id,value:dataset})
  }
  const handleMultiChange = (id,dataset) => {
    onSubItemChange({id,value: dataset})
  }
  const handleSingleChange = (id, dataset) => {
    if(typeof dataset === 'object'){
      onSubItemChange(dataset)
    }else{
      onSubItemChange({id,value:dataset})
    }
  }
  return(
    <View style='margin: 10rpx;'>
      <View className={`'check-button' ${params.selected ? 'check-button-active' : 'check-button-unactive'}`} onClick={onBtnItemClick} >
        {params.option.value}
      </View>
      {
        params.selected && params.option.subs && params.option.subs.length > 0 &&
        <View>
          {
            params.option.subs.map((sub,index) => 
              <View key={index}>
                {
                  sub.subjectTypeName === '填空题' && 
                  <AtInput 
                    name={sub.title}
                    title={sub.title}
                    value={sub.answer}
                    type='text' 
                    placeholder='请输入' 
                    onChange={handleChange.bind(this,sub.id)}
                  ></AtInput>
                }
                {
                  sub.subjectTypeName === '多选题' && 
                  <MultiCheckButton subOptions={sub.subOptions} title={sub.title} onMultiChange={handleMultiChange.bind(this,sub.id)} />
                }
                {
                  sub.subjectTypeName === '单选题' && 
                  <SingleCheckButton 
                    subOptions={sub.subOptions} 
                    title={sub.title} 
                    onSingleChange={handleSingleChange.bind(this,sub.id)} 
                  />
                }
              </View>
            )
          }
        </View>
      }
    </View>
  )
}
const SingleCheckButton =(params:{
  title: string,
  subOptions: any,
  onSingleChange: Function,
}) => {
  const [singleKey,setSingleKey] = useState()
  const {onSingleChange} = params
  const handleSingleCkBtnClick = (key) => {
    setSingleKey(key)
    onSingleChange(key)
  }
  const handleChange = (id,dataset) => {
    onSingleChange({id, value:dataset})
  }
  return(
    <View className='single-ck-btn'>
      <View>{params.title}</View>
      {
        params.subOptions.map((singleItem,index) => 
          <View 
            className={`'check-button' ${singleKey === singleItem.key ? 'check-button-active': 'check-button-unactive'}`} 
            style='margin:10rpx 20rpx' 
            key={index} 
            onClick={handleSingleCkBtnClick.bind(this,singleItem.key)}
          >
            {singleItem.value}
          </View>
        )
      }
      {
        params.subOptions.map((singleItem,index) => 
          {
            if(singleItem.key === singleKey &&  singleItem.subs && singleItem.subs.length > 0){
              return(
                <View>
                  {
                    singleItem.subs.map((singleItemSub,singleItemIndex) => 
                      <View key={singleItemIndex}>
                        {
                          singleItemSub.subjectTypeName === '填空题' && 
                          <AtInput 
                            className='text-input-long-header'
                            name={singleItemSub.title}
                            title={singleItemSub.title}
                            value={singleItemSub.answer}
                            type='text' 
                            placeholder='请输入' 
                            onChange={handleChange.bind(this,singleItemSub.id)}
                          ></AtInput>
                        }
                      </View>
                    )
                  }
                </View>
              )
            }
          }
        )
      }
    </View>
  )
}
const MultiCheckButton = (params:{
  title: string,
  subOptions: any,
  onMultiChange: Function
}) => {
  const onMultiChange = params.onMultiChange
  const handleMultiCkBtnClick = (key) => {
    const index = keys.indexOf(key)
    let keysTemp = []
    if(index === -1){
      keysTemp = [...keys,key]
    }else{
      keysTemp = [...keys]
      keysTemp.splice(index,1)
    }
    setKeys(keysTemp)
    onMultiChange(keysTemp.join(','))
  }
  const [keys,setKeys] = useState([])
 
  return(
    <View>
      <View>{params.title}</View>
      {
        params.subOptions.map((multiItem,index) => 
          <View className={`'check-button' ${keys.includes(multiItem.key) ? 'check-button-active': 'check-button-unactive'}`} style='margin:10rpx 20rpx' key={index} onClick={handleMultiCkBtnClick.bind(this,multiItem.key)}>{multiItem.value}</View>
        )
      }
    </View>
  )
}
const CheckButtons = (params:{
  options: any,
  onChange: Function,
  onSubChange: Function,
  id: string,
  type: string,
}) => {
  const {onChange,onSubChange} = params
  const [currentIndex,setCurrentIndex] = useState(null)
  const handleChange = (index,dataset) => {
    setCurrentIndex(index)
    // console.log('checkButtons',dataset)
    if(typeof onChange === 'function'){
      const id = params.id
      const key = dataset.key
      const value = dataset.value
      onChange({id,key,value,type: params.type})
    }
  }
  const handleSubItemChange = dataset => {
    onSubChange({...dataset,type: params.type})
  }
  if(params.options && params.options.length > 0){
    return(
      <View>
        {
          params.options.map((option,index) => 
            <CheckButtonItem 
              key={index} 
              option={option} 
              selected={currentIndex === index} 
              onItemChange={handleChange.bind(this,index)}
              onSubItemChange={handleSubItemChange}
            ></CheckButtonItem>
          )
        }
      </View>
    )
  }else{
    return null
  }
}

export default function QuestionItem(props: {
  id: string,
  subOptions: any,
  subjectType?: number,
  subjectTypeName: string,
  title: string,
  sort?: number,
  answer: string,
  onChange: Function,
  onSubChange: Function,
}) {
  const { onChange, onSubChange } = props
  const handleChange = (id,value) => {
    // console.log('填空题',id,value);
    onChange({id,value,type: props.subjectTypeName})
  }
  const onCheckBtnChange = (value) => {
    onChange(value)
  }
  const onSubCkBtnChange = (value) => {
    onSubChange(value)
  }
  return(
    <View>
      <View>{props.title}</View>
      {
        props.subjectTypeName === '单选题' &&
        <CheckButtons 
          id={props.id} 
          options={props.subOptions} 
          onChange={onCheckBtnChange}
          onSubChange={onSubCkBtnChange}
          type={props.subjectTypeName}
        ></CheckButtons>
      }
      {
        props.subjectTypeName === '填空题' && 
        <View>
          <AtInput 
            name={props.id}
            title='' 
            type='number' 
            value={props.answer}
            placeholder='请输入' 
            onChange={handleChange.bind(this,props.id)}
          ></AtInput>
        </View>
      }
    </View>
  )
}