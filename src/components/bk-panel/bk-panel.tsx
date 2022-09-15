import * as React from 'react'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './bk-panel.less'

export default function BkPanel(props: {
  arrow?: boolean,
  style?: string,
  children?: any,
  iconColor?: string,
  onClick?: Function,
}) {
  const { onClick } = props
  const onclick = () => {
    if(typeof onClick !== 'undefined'){
      onclick && onClick()
    }
  }
  return(
    <View style={props.style ? props.style : ''} className='bk-panel' onClick={onclick.bind(this)}>
      <View style={props.arrow ? '' : 'width: 100%'}>
        {props.children}
      </View>
      {
        props.arrow &&
        <View style='display:flex;align-items: center'>
          <AtIcon size='20' value='chevron-right' color={props.iconColor ? props.iconColor : '#C3C3C7'} />
        </View>
      }
    </View>
  )
}