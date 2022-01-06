import * as React from 'react'
import { View } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import './bk-panel.less'

/**
 * 
 * @param onClick
 * @param arrow: boolean 
 * @returns 
 */
export default function BkPanel(props: {
  arrow?: boolean,
  style?: string,
  children?: any,
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
      <View style='flex:1'>
        {props.children}
      </View>
      {
        props.arrow &&
        <View style='display:flex;align-items: center'>
          <AtIcon size='20' value='chevron-right' color='#C3C3C7' />
        </View>
      }

    </View>
  )
}