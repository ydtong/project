// 人员库
let personPathSwitch ={
  development:`http://192.168.10.3:8108`,
  lan:`https://dgateway.allhome.com.cn/organization`,
  pred:`https://dgateway.allhome.com.cn/organization`,
  production:`https://gateway.allhome.com.cn/organization`
}
// 基础服务
let showPathSwitch ={
  development:`https://dgateway.allhome.com.cn/hiddencallbase`,
  lan:`https://dgateway.allhome.com.cn/hiddencallbase`,
  pred:`https://dgateway.allhome.com.cn/hiddencallbase`,
  production:`https://gateway.allhome.com.cn/hiddencallbase`
}

let showPath =showPathSwitch[process.env.NODE_ENV]
let personPath =personPathSwitch[process.env.NODE_ENV]

export default ({
  showPath,
  personPath
})
