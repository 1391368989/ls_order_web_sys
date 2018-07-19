const jurisdiction = {
  //只能添加权限（代理商添加） 其他无操作权限{ 工作台 ， 代理商管理 ，订单管理，财务管理 ，分析数据 ， 用户管理}
  '超级管理员':'superAdmin',
  //代理商管理 （代理商添加）订单管理 设置{  工作台，订单管理 ,代理商管理 ，设置}
  '管理员':'admin',
  // 工作台 订单管理 我的财务 客单 设置{  工作台，订单管理 ,代理商管理 ,财务管理-我的财务，客单，设置}
  '代理商':'agent',
  //代理商管理 订单管理 订单管理 代理商管理 报销信息 客单 设置{  工作台，订单管理 ,代理商管理 ,财务管理-报销信息，客单，设置}
  '网点':'dot',
  //财务管理，设置{  工作台，财务管理，设置}
  '财务组':'finance',
  //只能操作<代理商管理 ,设置> 其他无操作权限{  工作台 ， 代理商管理 ，订单管理，财务管理 ，分析数据 ，设置}
  '运营组':'operate',
  //合计 {  工作台 ，分析数据， 代理商管理 ，订单管理，财务管理 ，用户管理，客单，设置}
}
export const role = ['superAdmin','admin','agent','dot','finance','operate'];
const power = {
  //工作台
  'dashboard':['superAdmin','admin','agent','dot','finance','operate'],
  //分析数据
  'analysis':['superAdmin','operate'],
  //代理商管理
  'agent':['superAdmin','admin','operate'],
  //订单管理
  'order':['superAdmin','admin','agent','dot','operate'],
};

export default  power ;

