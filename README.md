# 全流程小程序taro重构版
### 下载代码
* https://github.com/bkyz/quanliucheng-weapp-taro
### 编辑器
推荐使用vscode
### 启动
* `npm install`安装依赖
* `npm run dev:weapp`已开发环境启动项目，待命令跑完后打开小程序开发工具，创建或导入项目，目录地址定位到项目根目录。
* `npm run prod:build`，这个指令会在生产环境下构建项目，构建出来的代码体积更小


必须是小程序的开发者才能正常打开小程序，如果不是开发者请联系产品经理处理。
医院名称 | appid
--- | ---
倍康测试医院 | wx93fdd2bbd8cdbdac
佛山顺德均安 | wxb65ac1853bdd51db
海珠妇幼 | wxa7f230d5e5f76b6f
荔湾骨科 | wxefa4a18bcb0b7cb9
广三黄浦区（新）| wx8aa91d24017aef63
广三荔湾区（旧）| wx4d35223b6ad22fb1
恩平妇幼 | wx8cf010c599418e7e

### 目录说明
```
-config --项目配置
-dist --编译后的文件目录
-ndoe_modeles --项目依赖
-src --源代码
  |-components --组件
  |-custom --医院配置文件
  |-enums --枚举类型文件
  |-images --图片
      |-icons --图标
  |-interfaces --接口文件
  |-pages --小程序页面
      |-bind-pack --绑卡相关页面分包
      |-hosp-pack --住院模块分包
      |-official-pack --官网模块分包
      |-payment-pack --缴费模块分包
      |-register-pack --挂号模块分包
      |-reports-pack --检查检验报告模块分包
      |-service-pack --自助服务模块分包
      |-其他页面
  |-service --接口文件
      |-card-api --绑卡相关api
      |-hosp-api --住院相关api
      |-official-api --官网相关api
      |-payment-api --缴费相关api
      |-register-api --挂号相关api
      |-reports-api --检查检验报告相关api
      |-service-api --自助服务相关api
      |-taro-api --taro的api封装
      |-user-api --登陆相关api
      |-wx-api --微信特有的api
  |-utils --工具类函数
```
**关于医院配置：** 为了适配不同医院专门创建了一个custom文件夹，在`custom/hosp-config`目录下，一个医院对应一个配置文件，在`src/custom/index.ts`文件里把`hospName`设置对应医院的文件名即可
例如广三老院区：
```

const hospName = 'guang_san_li_wan'
const hospConfig = require(`./hosp-config/${hospName}`)
const config = hospConfig.default

export default config
```


**关于分包：** 小程序目前的规则是总代码体积不大于20M,单个分包和主包的体积不大于2M，属于一个模块的都放在一个分包里面，可以复用的组件放在主包里，不会复用的组件可以放在分包里。

**关于接口书写：** 
* 与后端约定如果是post请求，那传参就放在body里，如果是get请求，传参就放在url里；
* 本项目支持typescript，接口入参最好定义成类型，方便调用；
* 接口命名尽量体现接口用途和方法；查询类的接口，如果是post请求就用fetch开头，如果是get请求就用get开头
例如：
```
export const fetchMedicineInfo = (data: {orderId: string}) => {
  return Post(fullUrl('api/applet/paybill/Bill/GetDrugStateInfo'),data)
}
```

**关于命名规则：** 
* 文件名用英文小写横线链接命名；
* 变量名用首字母小写的驼峰命名法；
* 如果变量是拼音，那就用首字母大写的驼峰命名法；
* 枚举类用全大写加下划线命名；
* 图片用小写加下划线命名

**关于代码风格：** 
* 保持eslint启用，尽量把不规范的警告处理掉；
* 优先使用react hooks风格代码，目前只有在需要用到第三方插件的时候，不得不使用react类组件或者小程序原生写法
