export const mockData = 
{
  "result": true,
  "resultCode": 0,
  "popUpCode": 1,
  "message": "",
  "data": {
    "questionnaireId": 1,
    "questionnaireTitle": "诊后满意度调查",
    "questionnaireSubjectList": [
      {
        "id": "0788c642-fbd7-4e22-a50f-143dcf9266d2",
        "title": "您就诊的科室是",
        "subjectType": 2,
        "subjectTypeName": "单选题",
        "subOptions": [
          {
            "key": "a",
            "value": "急诊科",
            "subs": null
          },
          {
            "key": "b",
            "value": "专家门诊",
            "subs": null
          },
          {
            "key": "c",
            "value": "疼痛科",
            "subs": null
          },
          {
            "key": "d",
            "value": "普通外科/男性专科/肛肠科",
            "subs": null
          },
          {
            "key": "e",
            "value": "皮肤科",
            "subs": null
          },
          {
            "key": "f",
            "value": "五官科",
            "subs": null
          },
          {
            "key": "g",
            "value": "妇科门诊",
            "subs": null
          },
          {
            "key": "h",
            "value": "中西医结合科门诊",
            "subs": null
          },
          {
            "key": "i",
            "value": "儿科门诊",
            "subs": null
          },
          {
            "key": "j",
            "value": "口腔科",
            "subs": null
          },
          {
            "key": "k",
            "value": "健康管理中心",
            "subs": null
          },
          {
            "key": "m",
            "value": "发热门诊",
            "subs": null
          }
        ],
        "answer": null,
        "sort": 1
      },
      {
        id: 'custom-ques1',
        title: '您的投诉或建议',
        subjectTypeName: '填空题',
        answer: null
      },
      // {
      //   "id": "20900e3d-f096-4f26-9e0f-538c794d7681",
      //   "title": "1、您对医生的服务是否满意？",
      //   "subjectType": 2,
      //   "subjectTypeName": "单选题",
      //   "subOptions": [
      //     {
      //       "key": "a",
      //       "value": "满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "b",
      //       "value": "基本满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "c",
      //       "value": "不满意",
      //       "subs": null
      //     }
      //   ],
      //   "answer": null,
      //   "sort": 2
      // },
      // {
      //   "id": "7f848193-8293-4e7a-99c9-e5448ea1e67b",
      //   "title": "2、您对护士的服务是否满意？",
      //   "subjectType": 2,
      //   "subjectTypeName": "单选题",
      //   "subOptions": [
      //     {
      //       "key": "a",
      //       "value": "满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "b",
      //       "value": "基本满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "c",
      //       "value": "不满意",
      //       "subs": null
      //     }
      //   ],
      //   "answer": null,
      //   "sort": 3
      // },
      // {
      //   "id": "face8c3b-ce3e-4731-83c0-cbee0a5727f0",
      //   "title": "3、医生是否有进行病情、治疗方案、医保费用等方面的告知？",
      //   "subjectType": 2,
      //   "subjectTypeName": "单选题",
      //   "subOptions": [
      //     {
      //       "key": "a",
      //       "value": "有",
      //       "subs": null
      //     },
      //     {
      //       "key": "b",
      //       "value": "没有",
      //       "subs": null
      //     }
      //   ],
      //   "answer": null,
      //   "sort": 4
      // },
      {
        "id": "13ef0cbe-7c85-47cc-8f7a-0742af2d7a9d",
        "title": "4、如果有进行检查，您是在哪个医技科室检查？（可多选）",
        "subjectType": 3,
        "subjectTypeName": "多选题",
        "subOptions": [
          {
            "key": "a",
            "value": "超声",
            "subs": null
          },
          {
            key: 'd',
            value: '建议',
            subs: [
              {
                "id": "custom-ques2",
                "title": "",
                "subjectType": 1,
                "subjectTypeName": "填空题",
                "subOptions": null,
                "answer": null,
                "sort": 1
              }
            ]
          },
          {
            "key": "b",
            "value": "心电图",
            "subs": null
          },
          {
            "key": "c",
            "value": "影像科",
            "subs": null
          },
          {
            "key": "d",
            "value": "检验科",
            "subs": null
          },
          {
            "key": "e",
            "value": "没有检查",
            "subs": null
          }
        ],
        "answer": null,
        "sort": 5
      },
      {
        "id": "eb9d38d9-74f1-abaf-63c6-ec91caa30423",
        "title": "5、您对超声工作人员的服务态度是否满意？",
        "subjectType": 2,
        "subjectTypeName": "单选题",
        "subOptions": [
          {
            "key": "a",
            "value": "满意",
            "subs": null
          },
          {
            "key": "b",
            "value": "基本满意",
            "subs": null
          },
          {
            "key": "c",
            "value": "不满意",
            "subs": null
          }
        ],
        "answer": null,
        "sort": 6
      },
      // {
      //   "id": "5f5259ed-5ac5-864a-f2b9-d370192d0522",
      //   "title": "6、您对心电图工作人员的服务态度是否满意？",
      //   "subjectType": 2,
      //   "subjectTypeName": "单选题",
      //   "subOptions": [
      //     {
      //       "key": "a",
      //       "value": "满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "b",
      //       "value": "基本满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "c",
      //       "value": "不满意",
      //       "subs": null
      //     }
      //   ],
      //   "answer": null,
      //   "sort": 7
      // },
      // {
      //   "id": "564e1029-97ed-2f1b-0434-a6d3f28ce250",
      //   "title": "7、您对影像科工作人员的服务态度是否满意？",
      //   "subjectType": 2,
      //   "subjectTypeName": "单选题",
      //   "subOptions": [
      //     {
      //       "key": "a",
      //       "value": "满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "b",
      //       "value": "基本满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "c",
      //       "value": "不满意",
      //       "subs": null
      //     }
      //   ],
      //   "answer": null,
      //   "sort": 8
      // },
      // {
      //   "id": "e2b855c0-3ef7-c323-26f5-0ef95f52a6ef",
      //   "title": "8、您对检验科工作人员的服务态度是否满意？",
      //   "subjectType": 2,
      //   "subjectTypeName": "单选题",
      //   "subOptions": [
      //     {
      //       "key": "a",
      //       "value": "满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "b",
      //       "value": "基本满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "c",
      //       "value": "不满意",
      //       "subs": null
      //     }
      //   ],
      //   "answer": null,
      //   "sort": 9
      // },
      // {
      //   "id": "79ed4f51-4c84-41b3-aff7-3c156df5645e",
      //   "title": "9、您对收费员的服务态度是否满意？",
      //   "subjectType": 2,
      //   "subjectTypeName": "单选题",
      //   "subOptions": [
      //     {
      //       "key": "a",
      //       "value": "满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "b",
      //       "value": "基本满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "c",
      //       "value": "不满意",
      //       "subs": null
      //     }
      //   ],
      //   "answer": null,
      //   "sort": 10
      // },
      // {
      //   "id": "6f89f7f5-4ff7-bb08-75ac-54b5a9ad4499",
      //   "title": "10、您对药房工作人员的服务态度是否满意？",
      //   "subjectType": 2,
      //   "subjectTypeName": "单选题",
      //   "subOptions": [
      //     {
      //       "key": "a",
      //       "value": "满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "b",
      //       "value": "基本满意",
      //       "subs": null
      //     },
      //     {
      //       "key": "c",
      //       "value": "不满意",
      //       "subs": null
      //     }
      //   ],
      //   "answer": null,
      //   "sort": 11
      // },
      {
        "id": "7e8beb9f-e6fd-4465-979a-8a98a68df995",
        "title": "11、您觉得哪个就诊环节仍需改进？",
        "subjectType": 2,
        "subjectTypeName": "单选题",
        "subOptions": [
          {
            "key": "a",
            "value": "无",
            "subs": null
          },
          {
            "key": "b",
            "value": "有",
            "subs": [
              {
                "id": "b2ce5c3d-a89f-4208-aec1-1be9d6fcb188",
                "title": "",
                "subjectType": 1,
                "subjectTypeName": "填空题",
                "subOptions": null,
                "answer": null,
                "sort": 1
              }
            ]
          }
        ],
        "answer": null,
        "sort": 12
      },
      {
        "id": "718f58a7-90a8-481f-a41f-8ca73712852e",
        "title": "12、您对就诊的总体感觉是否满意度？",
        "subjectType": 2,
        "subjectTypeName": "单选题",
        "subOptions": [
          {
            "key": "满意",
            "value": "满意",
            "subs": null
          },
          {
            "key": "基本满意",
            "value": "基本满意",
            "subs": null
          },
          {
            "key": "不满意",
            "value": "不满意",
            "subs": null
          }
        ],
        "answer": null,
        "sort": 13
      }
    ]
  }
}