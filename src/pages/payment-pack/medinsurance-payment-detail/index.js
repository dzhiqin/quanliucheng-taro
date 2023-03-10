// eslint-disable-next-line no-undef
Page({
  data: {
    prescriptionList: [
      {
        title: '就诊信息',
        list: [
          { label: '门诊类别', value: '门(急)诊' },
          { label: '门诊科室', value: '普通内科' },
          { label: '医生姓名', value: '张三' },
          { label: '处方时间', value: '2021/06/08 14:54:00' },
          { label: '费用总额', value: '368.50元', highlight: true },
        ]
      },
      {
        title: '诊断信息',
        list: [
          { label: '诊断名称', value: '外伤肿胀' },
          { label: '诊断编号', value: 'E3D.25' },
        ]
      },
      {
        title: '特殊信息',
        list: [
          { label: '病情名称', value: '高血压' },
          { label: '病情编号', value: '2220003495858' },
        ]
      },
      {
        title: '费用信息',
        list: [
          { label: '万通胫骨贴*1', subLabel: '8g/片/3', value: '37.80元' },
          { label: '阿莫西林*1', subLabel: '8g/片/3', value: '7.80元' },
        ]
      },
      {
        title: '其他抵扣金额',
        list: [
          { label: '住院押金抵扣', value: '50元' },
          { label: '医院负担金额抵扣', value: '50元' },
        ]
      },
    ],
    actionsheetVisible: false
  },
  handleActionsheet() {
    this.actionsheetVisible = !this.actionsheetVisible;
    this.setData({
      actionsheetVisible: this.actionsheetVisible
    });
  }
})
