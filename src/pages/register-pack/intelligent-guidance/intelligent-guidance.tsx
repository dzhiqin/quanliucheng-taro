import { View,Image,Switch } from "@tarojs/components"
import * as React from 'react'
import * as Taro from '@tarojs/taro'
import { useReady } from "@tarojs/taro"
import manBackPng from '@/images/man_back_bg.png'
import manFrontPng from '@/images/man_front_bg.png'
import womanBackPng from '@/images/woman_back_bg.png'
import womanFrontPng from '@/images/woman_front_bg.png'
import './intelligent-guidance.less'
import { AtTabs } from 'taro-ui'
import { useState } from "react"
import { toastService } from "@/service/toast-service"

export default function IntelligentGuidance() {
  const [genderIndex,setGenderIndex] = useState(0)
  const genderArray = [{title: '男性'},{title: '女性'}]
  const [side,setSide] = useState(true)
  
  useReady(() => {
    console.log(Taro.getSystemInfoSync());
    
  })
  const handleChange = (e) => {
    setGenderIndex(e)
  }
  const handleSideChange = (e) => {
    setSide(e.detail.value)
  }
  const ManFront = () => {
    const handleClick = (e) => {
      toastService({title: e})
    }
    return(
      <View className='guidance-man'>
        <View onClick={handleClick.bind(this,'head')} className='guidance-man-front-head' />
        <View onClick={handleClick.bind(this,'neck')} className='guidance-man-front-neck'></View>
        <View onClick={handleClick.bind(this,'chest')} className='guidance-man-front-chest'></View>
        <View onClick={handleClick.bind(this,'belly')} className='guidance-man-front-belly'></View>
        <View onClick={handleClick.bind(this,'left-arm')} className='guidance-man-front-leftarm'></View>
        <View onClick={handleClick.bind(this,'right-arm')} className='guidance-man-front-rightarm'></View>
        <View onClick={handleClick.bind(this,'genital')} className='guidance-man-front-genital'></View>
        <View onClick={handleClick.bind(this,'left-leg')} className='guidance-man-front-leftleg'></View>
        <View onClick={handleClick.bind(this,'right-leg')} className='guidance-man-front-rightleg'></View>
        <Image src={manFrontPng} className='guidance-bg' />
      </View>
    )
  }
  const ManBack = () => {
    const handleClick = (e) => {
      toastService({title: e})
    }
    return (
      <View className='guidance-man'>
        <View onClick={handleClick.bind(this,'head')} className='guidance-man-back-head' />
        <View onClick={handleClick.bind(this,'back')} className='guidance-man-back-neck'></View>
        <View onClick={handleClick.bind(this,'chest')} className='guidance-man-back-chest'></View>
        <View onClick={handleClick.bind(this,'waist')} className='guidance-man-back-waist'></View>
        <View onClick={handleClick.bind(this,'left-arm')} className='guidance-man-back-leftarm'></View>
        <View onClick={handleClick.bind(this,'right-arm')} className='guidance-man-back-rightarm'></View>
        <View onClick={handleClick.bind(this,'hips')} className='guidance-man-back-hips'></View>
        <View onClick={handleClick.bind(this,'left-leg')} className='guidance-man-back-leftleg'></View>
        <View onClick={handleClick.bind(this,'right-leg')} className='guidance-man-back-rightleg'></View>
        <Image src={manBackPng} className='guidance-bg' />
      </View>
    )
  }
  const WomanFront = () => {
    const handleClick = (e) => {
      toastService({title: e})
    }
    return (
      <View className='guidance-woman'>
        <View onClick={handleClick.bind(this,'head')} className='guidance-woman-front-head' />
        <View onClick={handleClick.bind(this,'neck')} className='guidance-woman-front-neck'></View>
        <View onClick={handleClick.bind(this,'chest')} className='guidance-woman-front-chest'></View>
        <View onClick={handleClick.bind(this,'belly')} className='guidance-woman-front-belly'></View>
        <View onClick={handleClick.bind(this,'left-arm')} className='guidance-woman-front-leftarm'></View>
        <View onClick={handleClick.bind(this,'right-arm')} className='guidance-woman-front-rightarm'></View>
        <View onClick={handleClick.bind(this,'genital')} className='guidance-woman-front-genital'></View>
        <View onClick={handleClick.bind(this,'left-leg')} className='guidance-woman-front-leftleg'></View>
        <View onClick={handleClick.bind(this,'right-leg')} className='guidance-woman-front-rightleg'></View>
        <Image src={womanFrontPng} className='guidance-bg' />
      </View>
    )
  }
  const WomanBack = () => {
    const handleClick = (e) => {
      toastService({title: e})
    }
    return (
      <View className='guidance-woman'>
        <View onClick={handleClick.bind(this,'head')} className='guidance-woman-back-head' />
        <View onClick={handleClick.bind(this,'neck')} className='guidance-woman-back-neck'></View>
        <View onClick={handleClick.bind(this,'back')} className='guidance-woman-back-chest'></View>
        <View onClick={handleClick.bind(this,'waist')} className='guidance-woman-back-waist'></View>
        <View onClick={handleClick.bind(this,'left-arm')} className='guidance-woman-back-leftarm'></View>
        <View onClick={handleClick.bind(this,'right-arm')} className='guidance-woman-back-rightarm'></View>
        <View onClick={handleClick.bind(this,'hips')} className='guidance-woman-back-hips'></View>
        <View onClick={handleClick.bind(this,'left-leg')} className='guidance-woman-back-leftleg'></View>
        <View onClick={handleClick.bind(this,'right-leg')} className='guidance-woman-back-rightleg'></View>
        <Image src={womanBackPng} className='guidance-bg' />
      </View>
    )
  }
  return (
    <View className='guidance'>
      <AtTabs animated={false} tabList={genderArray} onClick={handleChange.bind(this)} current={genderIndex} />
      <View className='guidance-switch'>
        <Switch name='name' onChange={handleSideChange.bind(this)} checked={side} />{side ? '正面' : '反面'}
      </View>
      {
        genderArray[genderIndex].title === '男性' && side &&
        <ManFront />
      }
      {
        genderArray[genderIndex].title === '男性' && !side &&
        <ManBack />
      }
      {
        genderArray[genderIndex].title === '女性' && side &&
        <WomanFront />
      }
      {
        genderArray[genderIndex].title === '女性' && !side &&
        <WomanBack />
      }
    </View>
  )
}