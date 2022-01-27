import * as React from 'react'
import { View } from '@tarojs/components'
import { useState } from 'react'
import Blog from '../blog/blog'

import BkTitle from '../bk-title/bk-title'

export default function HospBlog(props: any) {
  const [list] = useState(props.list || [1,2])
  return (
    <View className='hosp-blog' style='padding: 40rpx;'>
      <BkTitle title='医院' more onClickMore={() => console.log('click more')}></BkTitle>
      {list.map((item,index) => <Blog>123</Blog>)}
    </View>
  )
}