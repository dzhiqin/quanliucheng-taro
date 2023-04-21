import * as React from 'react'
import { View } from '@tarojs/components'
import { useState,useEffect } from 'react'
import './bk-radios.less'

export default function BkRadios(
  props: {
    options: {name: string, value: string | number}[],
    value: string | number,
    style?: string,
    name: string,
    activeColor?: string,
    onRadioChaneg: Function
  }
){
  const [currentValue, setCurrentValue] = useState(props.value)
  const activeRadio={
    backgroundColor: props.activeColor || '#56A1F4',
    color: '#fff'
  }
  const unActiveRadio = {
    backgroundColor: '#eeeeee',
    color: '#333333'
  }
  const handleRadioChange = (item) => {
    setCurrentValue(item.value)
    props.onRadioChaneg(item)
  }
  return (
    <View className='bk-radios flex-between' style={props.style ? props.style : ''}>
      <View style=''>{props.name}</View>
      <View className='flex'>
        {
          props.options.map((item,index) => <View onClick={handleRadioChange.bind(null, item)} key={index} className='bk-radios-radio' style={item.value === currentValue ? activeRadio : unActiveRadio}>
            {item.name}
          </View>)
        }
      </View>
    </View>
  )
}