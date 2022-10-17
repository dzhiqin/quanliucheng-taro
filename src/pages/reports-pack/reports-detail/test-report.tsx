import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { custom } from '@/custom/index'
import BkButton from '@/components/bk-button/bk-button'
import './reports-detail.less'

export default function TestReport(props) {
  const setting = custom.reportsPage
  const {checkItems} = props
  const onClick = (e) => {
    Taro.previewImage({
      current: e,
      urls: [e]
    })
  }
  const getReferResult = (key) => {
    switch(key){
      case 'H': return '偏高';
      case 'L': return '偏低';
      case 'N': return '正常';
      default: return key;
    }
  }

  return(
    <View className='reports-detail'>
      {
        setting.urlDetail && 
        <View className='reports-detail-content'>
          <Image src={checkItems[0]? checkItems[0].url : ''} />
          <View className='reports-detail-footer'>
            {
              checkItems[0] && checkItems[0].url &&
              <BkButton title='查看图片' onClick={onClick.bind(null,checkItems[0]? checkItems[0].url : '')} />
            }
          </View>
        </View>
      }
      {
        !setting.urlDetail &&
        <View className='table'>
          <View className='at-row table-header'>
            <View className='at-col table-header-item at-col-4'>项目名称</View>
            <View className='at-col table-header-item at-col-2'>结果</View>
            <View className='at-col table-header-item at-col-2'>单位</View>
            <View className='at-col table-header-item at-col-2'>参考值</View>
            <View className='at-col table-header-item at-col-2'>参考结果</View>
          </View>
          {
            checkItems.map((item,index) => 
              <View className='at-row' key={index}>
                <View className='at-col table-body-item at-col-4'>{item.labRepItemName}{item.prompt ? '/'+item.prompt : ''}</View>
                <View className='at-col table-body-item at-col-2'>{item.labRepResult}</View>
                <View className='at-col table-body-item at-col-2'  style='font-size: 26rpx'>{item.labRepUnits}</View>
                <View className='at-col table-body-item at-col-2'>{item.labContext}</View>
                <View className='at-col table-body-item at-col-2'>
                  {getReferResult(item.labInd)}
                </View>
              </View>
            )
          }
        </View>
      }
    </View>
  )
}