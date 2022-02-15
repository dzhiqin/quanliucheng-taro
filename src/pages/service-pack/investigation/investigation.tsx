import * as React from 'react'
import * as Taro from '@tarojs/taro'
// import { getInvestigationTypes } from '@/service/api';
import { View } from '@tarojs/components'

export default function Investigation(){
  const router = Taro.useRouter()
  const params = router.params
  console.log('params',params);

  React.useEffect(() => {
    // getInvestigationTypes().then(res => {
    //   console.log(res);
      
    // })
  },[])
  return (
    <View>hi</View>
  )
}