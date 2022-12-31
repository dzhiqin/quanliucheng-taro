import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { useState,useEffect } from 'react'
import GreenEnergyBubble  from '@/images/icons/green-energy-bubble.png'

export default function GreenEnergyToast(props: {energy: number | string,show: boolean,text: string}) {
  const [opened,setOpened] = useState(props.show)
  useEffect(() => {
    setOpened(props.show)
    setTimeout(() => {
      setOpened(false)
    },2000)
  },[props.show])
  
  if(opened){
    return(
      <View className='green-energy flex-justify-center'>
        <Image className='green-energy-icon' src={GreenEnergyBubble}></Image>
        <View> {props.text}</View>
        <View className='green-energy-value'>{props.energy}g</View>
      </View>
    )
  }else{
    return null
  }
  
}


