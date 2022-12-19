import * as Taro from '@tarojs/taro'
import * as React from 'react'
import { View, Image } from '@tarojs/components'
import { fetchDoctorSchedules, fetchTimeListByDate, fetchDoctorDetail } from '@/service/api'
import { useEffect, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import { loadingService, modalService, toastService } from '@/service/toast-service'
import ScheduleDays from '@/pages/register-pack/components/schedule-days/schedule-days'
import { AtList, AtListItem } from "taro-ui"
import BkLoading from '@/components/bk-loading/bk-loading'
import './doctor-detail.less'
import { CardsHealper } from '@/utils/cards-healper'
import BaseModal from '@/components/base-modal/base-modal'
import { getImageSrc } from '@/utils/image-src'
// import {mockList} from './mock'

interface Options {
  doctorId: string,
  regDate: string,
  deptId: string,
  deptName?: string,
  branchId: string,
  sourceType?: string
}
export default function DoctorDefault() {
  const router = useRouter()
  const {scene,slices} = router.params
  let options = JSON.parse(router.params.options) as Options
  const hospitalInfo = Taro.getStorageSync('hospitalInfo')
  options.branchId = hospitalInfo.branchId
  if(scene){
    // 场景值：扫描小程序码1047; 长按图片识别小程序码1048; 扫描手机相册中选取的小程序码1049
    // 扫小程序码会带名为scene的参数，参数格式为 scene: "slices=01_145_11042" 
    // scene值说明：slices=branchId_deptId_doctorId
    const a = decodeURIComponent(scene)
    const b = a.replace('slices=','').split('_')
    options = {
      branchId: b[0],
      deptId: b[1],
      doctorId: b[2],
      regDate: ''
    }
  }
  if(slices){
    // 兼容荔湾骨科旧的医生二维码
    const a = decodeURIComponent(slices)
    const b = JSON.parse(a)
    options = {
      branchId: b.branchId,
      deptId: b.deptId,
      doctorId: b.doctorId,
      regDate: b.defaultDay ? b.defaultDay : ''
    }
  }
  const [regDays,setRegDays] = useState([])
  const [selectedDate,setSelectedDate] = useState(options.regDate || '')
  const [list,setList] = useState([])
  const [busy,setBusy] = useState(true)
  const [show,setShow] = useState(false)
  const [doctorDetail,setDoctorDetail] = useState({
    deptName: '',
    faceUrl: '',
    name: '',
    title: '',  // 来源医生信息的医生title
    specialty:'',
    doctorId: '',
    doctorName: '',
    desc: ''
  })
  const [doctorInfo,setDoctorInfo] = useState({
    sourceType: '',
    regType:'',
    regFee: '',
    address: '',
    regTypeId:'',
    specializedSubject:'',
    title: '' // 来源his排班信息的医生title
  })
  const onClickItem = (item) => {
    if(!item.isTimeValid){
      toastService({title: '已超过挂号时间'})
      return
    }
    if(item.isHalt){
      toastService({title: '已停诊'})
      return
    }
    const userInfo = Taro.getStorageSync('userInfo')
    const card = CardsHealper.getDefault()
    if(!card) {
      toastService({title: '找不到就诊卡'})
      return
    }
    if(item.leaveCount <= 0) {
      toastService({title: '没号了~请重新选择'})
      return
    }
    const orderParams = {
      cardNo: card.cardNo,
      hospitalId: userInfo.hospitalId,
      branchId: options.branchId,
      patientId: card.patientId,
      patientName: card.name,
      deptId: options.deptId, 
      deptName: options.deptName,
      doctorId: doctorDetail.doctorId,
      doctorName: doctorDetail.name || doctorDetail.doctorName,
      regDate: selectedDate,
      scheduleId: item.scheduleId,
      timeSlice: item.startTime.split(':')[0] > 12 ? '下午' : '上午',
      sliceId: item.sliceId,
      sqNo: item.sqNo,
      startTime: item.startTime,
      endTime: item.endTime,
      sourceType: item.sourceType || doctorInfo.sourceType, // 优先获取从GetScheduleTimePoints中获取的sourceType
      sourceId: doctorInfo.regType,
      regNo: '',
      feeType: '0',   // 对应feeCode字段
      regFee: doctorInfo.regFee,
      treatFee: '',
      address: doctorInfo.address,
      regTypeId: item.regTypeId || doctorInfo.regTypeId, // 优先获取从GetScheduleTimePoints中获取的regTypeId
      timeInterval: item.timeInterval // 广三黄埔新增字段
    }
    Taro.setStorageSync('orderParams',orderParams)
    Taro.navigateTo({url: '/pages/register-pack/order-create/order-create'})
    
  } 
  const onDateChange = (date) => {
    if(!date) return
    setSelectedDate(date)
    loadingService(true)
    fetchTimeListByDate({
      deptId: options.deptId, 
      regDate: date, 
      doctorId: options.doctorId,
      regType: options.sourceType || doctorInfo.sourceType//regtype和sourceType值相同，字段未统一
    }).then(res => {
      loadingService(false)
      if(res.resultCode === 0){
        setList(res.data.timePoints.map(item => {
          return {
            ...item,
            isTimeValid: timeValid(date,item.endTime)
          }
        }))
      }else{
        modalService({title: '获取分时失败',content: res.message})
        setList([])
      }
    }).catch((err) => {
      loadingService(false)
      modalService({title: '获取分时失败',content: JSON.stringify(err)})
    })
  }
  Taro.useDidShow(() => {
    setBusy(true)
    setList([])
    fetchDoctorSchedules({
      doctorId: options.doctorId, 
      deptId: options.deptId, 
      regDate: options.regDate || '' ,
      sourceType: options.sourceType
    }).then((res:any) => {
      if(res.resultCode === 0){
        if(res.data.doctorDetail){
          setDoctorDetail(res.data.doctorDetail)
        }
        setDoctorInfo(res.data.timeSliceDoctorInfo)
        setRegDays(res.data.regDays)
        setSelectedDate(res.data.defaultSelectedDay)

        if(res.data.defaultSelectedDay === '无剩余号源'){
          let msg = '无剩余号源，请返回页面重新选择'
          if(Taro.getStorageSync('isReg') === '1'){
            msg = '当天没号了，请选择其他日期'
          }
          modalService({content: msg})
          setBusy(false)
        }else{
          // res.data.timePoints=mockList
          setList(res.data.timePoints.map(item => {
            return {
              ...item,
              isTimeValid: timeValid(res.data.defaultSelectedDay,item.endTime)
            }
          }))
          setTimeout(() => {
            setBusy(false)
          }, 500);
        }
      }else{
        modalService({title: '获取数据失败：',content:res.message})
        setBusy(false)
      }
    })
  })
 
  useEffect(() => {
    fetchDoctorDetail({deptId: options.deptId, doctorId: options.doctorId}).then(res => {
      if(res.resultCode === 0 && res.data){
        setDoctorDetail(res.data)
      }
    })
  },[options.deptId,options.doctorId])
  const renderTickets = (item) => {
    if(item.isHalt) return '停诊'
    // eslint-disable-next-line no-restricted-globals
    if(isNaN(parseInt(item.leaveCount))) return item.leaveCount
    if(item.leaveCount > 9999) return '不限号' // 特殊处理
    if(item.leaveCount > 0) return `剩余:${item.leaveCount}`
    return '无号'
  }
  const currentTime = new Date().getTime()
  const timeValid = (date,time) => {
    if(!time) return true
    const dateAndTime = date + ' ' + time
    return new Date(dateAndTime.replace(/-/g, "/")).getTime() >  currentTime
  }
  const isActive = (item) => {
    // eslint-disable-next-line no-restricted-globals
    if(isNaN(parseInt(item.leaveCount))) return true
    if(parseInt(item.leaveCount) > 0 && !item.isHalt && item.isTimeValid) return true
    return false
  }
  return(
    <View className='doctor-detail'>
      <BaseModal show={show} cancel={() => setShow(false)} confirm={() => setShow(false)} title='医生详情'>
        <View className='flex'>
          <Image src={doctorDetail.faceUrl || getImageSrc('default-avatar.png')} className='doctor-modal-image' mode='aspectFill' />
          <View style='margin-left: 10rpx;'>
            <View className='doctor-detail-name'>{doctorDetail.name}</View>
            <View>{doctorDetail.deptName}</View>
            <View>{doctorInfo.title}</View>
          </View>
        </View>
        <View>
          {
            doctorDetail.desc && 
            <View className='doctor-modal-info'>
              <text className='doctor-modal-info-title'>简介：</text>
              {doctorDetail.desc.replace(/<br>|<Br>/g, ' ')}
            </View>
          }
          {
            doctorDetail.specialty && 
            <View className='doctor-modal-info'>
              <text className='doctor-modal-info-title'>擅长领域：</text>
              {doctorDetail.specialty.replace(/<br>|<Br>/g, ' ')}
            </View>
          }
        </View>
      </BaseModal>
      <View className='doctor-detail-info' onClick={() => setShow(true)}>
          <Image src={doctorDetail.faceUrl || getImageSrc('default-avatar.png')} className='doctor-detail-info-avatar' mode='aspectFill' />
        <View style='margin-left: 20rpx;'>
          <View>
            <text className='doctor-detail-name'>{doctorDetail.name}</text>
            <text className='doctor-detail-title'>{doctorDetail.deptName}</text>
            <text className='doctor-detail-title'>{doctorInfo.title}</text>
          </View>
          {
            doctorDetail.desc && 
            <View className='doctor-detail-skilled'>
              简介：{doctorDetail.desc.replace(/<br>|<Br>/g, ' ')}
            </View>
          }
          {
            doctorDetail.specialty && 
            <View className='doctor-detail-skilled'>
              擅长领域：{doctorDetail.specialty.replace(/<br>|<Br>/g, ' ')}
            </View>
          }
          
        </View>
      </View>
      <View className='doctor-detail-date'>已选：<text className='price-color'>{selectedDate}</text></View>
      <View className='doctor-detail-days'>
        <ScheduleDays days={regDays} defaultDay={selectedDate} onChange={onDateChange} />
      </View>
      <View className='doctor-detail-list'>
        {
          list.length > 0
          ? <AtList>
              {
                list.map((item,index) => 
                  <AtListItem 
                    key={index} 
                    title={`${item.timeSlice ? item.timeSlice: ''}${item.startTime} - ${item.endTime}`} 
                    extraText={renderTickets(item)}
                    className={isActive(item) ? 'ticket-btn-active' : 'ticket-btn-unactive'} 
                    arrow='right' 
                    onClick={onClickItem.bind(null,item)}
                  />
                )
              }
            </AtList>
          : <BkLoading loading={busy} msg='暂无排班信息' />
        }
      </View>
    </View>
  )
}