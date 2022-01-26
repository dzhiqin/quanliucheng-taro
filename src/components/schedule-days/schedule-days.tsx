import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { useEffect,useState } from 'react'
import { humanDate } from '@/utils/format'
import { useDidShow } from '@tarojs/taro'
import fullPng from '@/images/icons/isFull.png'
import nonePng from '@/images/icons/wu.png'

import './schedule-days.less'

const weeks = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
const today = humanDate(new Date())
export default function WeekSchedule(props:{
  onChange?: Function,
  days: any,
  defaultDay: string,
  showMonth?: boolean
}) {
  const {onChange} = props
  const [monthSpan,setMonthSpan] = useState('')
  const [schedules,setSchedules] = useState([])
  const getWeekByDate = (date) => {
    if(date === today){
      return '今天'
    }
    if(!date) return ''
    const day = new Date(date || '').getDay()
    return weeks[day]
  }
  const getDayByDate = (date) => {
    if(!date) return ''
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) return ''
    return date.split('-')[2]
  }
  const getDisableState = (value) =>{
    if(!value) return false
    return value === '无号' || value === '已停诊'
  }
  const onClickItem = (e) => {
    if(e.disable) return
    const date = e.date
    if(typeof onChange !== 'undefined'){
      onChange(date)
    }
    const schedulesData = schedules.map(item => {
      return {
        ...item,
        selected: item.date === date
      }
    })
    setSchedules(schedulesData)
  }
  useDidShow(() => {
   
  })
  useEffect(() => {
    let months = []
    let schedulesData = []
    if(props.days){
      schedulesData = props.days.map(item => {
        const month = item.date.split('-')[1]
        if(months.indexOf(month) === -1){
          months.push(month)
        }
        return  {
          ...item,
          week: getWeekByDate(item.date),
          day: getDayByDate(item.date),
          disable: getDisableState(item.scheduleStatusDescription),
          fullSchedule: item.scheduleStatusDescription === '已约满',
          selected: item.date === props.defaultDay
        }
      })
    }
    setSchedules(schedulesData)
    // setSchedules(schedulesData.slice(0,7)) // 默认返回了8天的排班，如果需要7天的，可以截取前7天
    setMonthSpan(months.join('~'))
  }, [props.days,props.defaultDay])
  return (
    <View className='week-schedule'>
      {
        props.showMonth &&
        <View className='month'>{monthSpan}月</View>
      }
      <View className='days'>
        {
          schedules.map((schedule,index) => 
            <View key={index} className={`days-item ${schedule.disable? 'disable' : ''} ${schedule.week === '今天' ? 'introday' : ''}`} onClick={onClickItem.bind(null,schedule)} >
              <View className='days-item-week'>{schedule.week}</View>
              <View className={`days-item-day ${schedule.selected ? 'day-selected' : 'day-unselect'}`}>{schedule.day}</View>
              {
                schedule.fullSchedule && 
                <Image src={fullPng} className='days-item-icon' />
              }
              {
                schedule.disable && 
                <Image src={nonePng} className='days-item-icon' />
              }
            </View>
          )
        }
      </View>
    </View>
  )
}