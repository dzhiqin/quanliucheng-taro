import { custom } from "../custom"

let IDTypes = 
[
  {
    id: 0,
    name: '身份证'
  },
  {
    id:7,
    name: '出生证'
  },
  {
    id:20,
    name: '儿童(无证件)'
  },
  {
    id: 1,
    name: '居民户口编号'
  },
  {
    id: 2,
    name: '护照'
  },
  {
    id:3,
    name: '军官证'
  },
  {
    id: 4,
    name: '门诊卡'
  },
  {
    id:5,
    name: '港澳居民来往内地通行证'
  },
  {
    id:6,
    name: '台湾居民来往内地通行证'
  },
  
  {
    id:8,
    name: '港澳居民身份证'
  },
  {
    id:10,
    name: '其他'
  }
]
if(custom.hospName === 'jszyy'){
  IDTypes = IDTypes.filter(item => item.id !== 20)
}
export const idenTypeOptions = IDTypes
export const feeTypeOptions = 
[
  {
    name: '自费',
    id: '1'
  },
  {
    name: '医保门特',
    id: 'D1001'
  },
  {
    name: '一类门特',
    id: 'YB1040'
  },
  {
    name: '二类门特',
    id: 'YB1041'
  },
  {
    name: '生育保险',
    id: '4401'
  },
  {
    name: '居民医保',
    id: '561'
  },
  {
    name: '普通医保',
    id: '51'
  },
  {
    name: '省直医保（普通门诊）',
    id: 'GDSZ61'
  },
  {
    name: '省直医保（门特）',
    id: 'GDSZ63'
  },
  {
    name: '市直医保（普通门诊）',
    id: 'GZSZ61'
  },
  {
    name: '市直医保（一类门特）',
    id: 'GZSZ63'
  },
  {
    name: '市直医保（二类门特）',
    id: 'GZSZ66'
  },
  {
    name: '公医普通',
    id: '2-0'
  },
  {
    name: '公医门慢',
    id: '2-1'
  },
  {
    name: '公医门特',
    id: '2-2'
  }
]
export const sourceTypeOptions = 
[
  {
    id: '1',
    title: '集中留观'
  }, {
    id: '2',
    title: '密切接触者'
  }, {
    id: '3',
    title: '交通检疫'
  }, {
    id: '4',
    title: '社区排查'
  }, {
    id: '5',
    title: '发热门诊'
  }, {
    id: '6',
    title: '其他门（急）诊'
  },{
    id: '7',
    title: '住院患者'
  },{
    id: '8',
    title: '住院患者陪护人员'
  },{
    id: '99',
    title: '其它采样点'
  }
]
export const identityOptions = 
[
  {
    id: '1',
    title: '外国籍留学生'
  },{
    id: '2',
    title: '复工复产人员'
  },{
    id: '3',
    title: '返校老师'
  },{
    id: '4',
    title: '返校学生'
  },{
    id: '5',
    title: '医疗机构工作人员'
  },{
    id: '6',
    title: '口岸检疫和边防检查人员'
  },{
    id: '7',
    title: '监所工作人员'
  },{
    id: '8',
    title: '社会福利养老机构工作人员'
  },{
    id: '9',
    title: '孕产妇'
  },{
    id: '10',
    title: '新生儿'
  },{
    id: '11',
    title: '母婴服务类机构人员'
  },{
    id: '99',
    title: '其它人群'
  }
]
export const symptomOptions = 
[
  {
    id: 'F1',
    title: '发病前14天内有湖北旅行或居住史'
  },{
    id: 'F2',
    title: '发热+50岁以上'
  },{
    id: 'F3',
    title: '发热+呼吸道症状'
  },{
    id: 'F4',
    title: '其他医生认为需要查咽拭子的情况'
  },{
    id: 'F5',
    title: '境外来穗人员'
  }
]
