import request from '../utils/request';
/*
 查询省
 * */
export async function getProvince() {
  return request('/order/city/selectProvince', {
    method: 'POST'
    });
}
/*
 根据省查询市
 * */
export async function getCity(query) {
  return request('/order/city/selectCity', {
    method: 'POST',
    body:query
  });
}
/*
 根据市查询省
 * */
export async function getDistrict(query) {
  return request('/order/city/selectDistrict', {
    method: 'POST',
    body:query
  });
}

/*
 通过类型查询字典表
* */
export async function selectDictByType(query) {
  return request('/order/dict/selectDictByType', {
    method: 'POST',
    body:query
  });
}

/*
 主订单列表
 * */
export async function getOrder(query) {
  return request('/order/order/selectOrder', {
    method: 'POST',
    body:query
  });
}

/*
 单个添加订单
 * */
export async function addOrder(query) {
  return request('/order/order/insertOrder', {
    method: 'POST',
    body:query
  });
}
/*
  订单与商家绑定
 * */
export async function insertOrderCompanyBind(query) {
  return request('/order/order/insertOrderCompanyBind', {
    method: 'POST',
    body:query
  });
}
/*
 订单与商家解除绑定
 * */
export async function deleteOrderCompanyBind(query) {
  return request('/order/order/deleteOrderCompanyBind', {
    method: 'POST',
    body:query
  });
}
/*
 截单(下架)
 * */
export async function interruptOrder(query) {
  return request('/order/order/interruptOrder', {
    method: 'POST',
    body:query
  });
}
/*
 查询订单绑定商家
 * */
export async function selectOrderIdByOrderId(query) {
  return request('/order/order/selectOrderIdByOrderId', {
    method: 'POST',
    body:query
  });
}
/*
 查询子订单
 * */
export async function selectChildOrder(query) {
  return request('/order/order/selectChildOrder', {
    method: 'POST',
    body:query
  });
}
/*
 商家审核拒绝该订单
 * */
export async function merchantRefuseChildOrder(query) {
  return request('/order/order/merchantRefuseChildOrder', {
    method: 'POST',
    body:query
  });
}
/*
 商家批量审核拒绝该订单
 * */
export async function merchantRefuseChildOrders(query) {
  return request('/order/order/merchantRefuseChildOrders', {
    method: 'POST',
    body:query
  });
}
/*
/*
 商家审核同意该订单
 * */
export async function merchantAgreeChildOrder(query) {
  return request('/order/order/merchantAgreeChildOrder', {
    method: 'POST',
    body:query
  });
}
/*
 商家批量审核同意该订单
 * */
export async function merchantAgreeChildOrders(query) {
  return request('/order/order/merchantAgreeChildOrders', {
    method: 'POST',
    body:query
  });
}

/*
 商家撤销操作
 * */
export async function merchantReviewChildOrder(query) {
  return request('/order/order/merchantReviewChildOrder', {
    method: 'POST',
    body:query
  });
}

/*
 平台批量审核同意该订单
 * */
export async function platformAgreeChildOrders(query) {
  return request('/order/order/platformAgreeChildOrders', {
    method: 'POST',
    body:query
  });
}
/*
 平台审核同意该订单
 * */
export async function platformAgreeChildOrder(query) {
  return request('/order/order/platformAgreeChildOrder', {
    method: 'POST',
    body:query
  });
}
/*
 平台审核拒绝该订单
 * */
export async function platformRefuseChildOrder(query) {
  return request('/order/order/platformRefuseChildOrder', {
    method: 'POST',
    body:query
  });
}

/*
 平台审核批量拒绝该订单
 * */
export async function platformRefuseChildOrders(query) {
  return request('/order/order/platformRefuseChildOrders', {
    method: 'POST',
    body:query
  });
}
/*
 平台撤销操作
 * */
export async function reviewChildOrder(query) {
  return request('/order/order/reviewChildOrder', {
    method: 'POST',
    body:query
  });
}

/*
* 获取用户菜单
* */
export async function getMenuData(query) {
  return request('/order/user/selectUserMenu', {
    method: 'POST',
    body:query
  });
}
/*
* 获取权限组列表
* */
export async function queryRule(query) {
  return request('/order/role/selectRole', {
    method: 'POST',
    body:query
  });
}
/*
* 删除某个权限组
* */
export async function removeRule(query) {
  return request('/order/menuData', {
    method: 'POST',
    body:query
  });
}
/*
* 新增某个权限组
* */
export async function addRule(query) {
  return request('/order/menuData', {
    method: 'POST',
    body:query
  });
}
/*
* 获取权限树
* */
export async function selectTree(query) {
  return request('/order/role/selectAllMenu', {
    method: 'POST',
    body:query
  });
}
/*
 * 获取菜单树
 * */
export async function getTree() {
  return request('/order/menu/selectAllMenu', {
    method: 'POST'
  });
}
/*
 * 获取权限树
 * */
export async function getRole(query) {
  return request('/order/role/selectRoleMenuIds', {
    method: 'POST',
    body:query
  });
}
/*
* 禁用某个权限组
* */
export async function toDisable(query) {
  return request('/order/role/changeRoleStatus', {
    method: 'POST',
    body:query
  });
}

/*
*  权限与菜单绑定
* */
export async function insertRoleMenuBind(query) {
  return request('/order/role/insertRoleMenuBind', {
    method: 'POST',
    body:query
  });
}
/*
*  更改權限組名稱
* */
export async function changeRoleName(query) {
  return request('/order/role/changeRoleName', {
    method: 'POST',
    body:query
  });
}
/*
*  更改權限組名稱
* */
export async function insertRole(query) {
  return request('/order/role/insertRole', {
    method: 'POST',
    body:query
  });
}
/*
*
 添加商家
* */
export async function insertCompany(query) {
  return request('/order/company/insertCompany', {
    method: 'POST',
    body:query
  });
}

/*
 *  修改商家信息
 * */

export async function updateCompany(query) {
  return request('/order/company/updateCompany', {
    method: 'POST',
    body:query
  });
}

/*
* /order/user/selectuser
 用户列表信息查询
* */
export async function selectuser(query) {
  return request('/order/user/selectuser', {
    method: 'POST',
    body:query
  });
}
/*
* 权限与用户绑定
* */
export async function insertRoleUserBind(query) {
  return request('/order/role/insertRoleUserBind', {
    method: 'POST',
    body:query
  });
}

/*
* 删除用户与权限绑定
* */
export async function deleteRoleUserBind(query) {
  return request('/order/role/deleteRoleUserBind', {
    method: 'POST',
    body:query
  });
}

/*
 *
 /order/role/selectRoleBindCompany
 查询权限绑定的商家
 * */
export async function selectRoleBindCompany(query) {
  return request('/order/role/selectRoleBindCompany', {
    method: 'POST',
    body:query
  });
}
/*
 *权限与公司绑定
* */
export async function companyBind(query) {
  return request('/order/role/insertRoleCompanyBind', {
    method: 'POST',
    body:query
  });
}
/*
* 删除公司与权限绑定
* */
export async function deleteRoleCompanyBind(query) {
  return request('/order/role/deleteRoleCompanyBind', {
    method: 'POST',
    body:query
  });
}

/*
 *改变权限类型
* */
export async function changeRoleType(query) {
  return request('/order/role/changeRoleType', {
    method: 'POST',
    body:query
  });
}

/*
* /order/company/selectCompany
 分页查询商家
* */

export async function selectCompany(query) {
  return request('/order/company/selectCompany', {
    method: 'POST',
    body:query
  });
}

/*
* 查询权限绑定的用户
* */
export async function selectAllRoleUserBind(query) {
  return request('/order/role/selectAllRoleUserBind', {
    method: 'POST',
    body:query
  });
}
/*
* 前端用户开始使用信息储存
* */
export async function saveUserInfo(query) {
  return request('/order/order/createUserOrderMsg', {
    method: 'POST',
    body:query
  });
}
/*
* 用户查询能够填写的订单
* */
export async function getOrderList(query) {
  return request('/order/order/selectOrderByUser', {
    method: 'POST',
    body:query
  });
}
/*
* 用户预加载订单
* */
export async function insertChildOrder(query) {
  return request('/order/order/insertChildOrder', {
    method: 'POST',
    body:query
  });
}
/*
* 用户取消子订单
* */
export async function userRemoveChildOrder(query) {
  return request('/order/order/userRemoveChildOrder', {
    method: 'POST',
    body:query
  });
}
/*
* 用户取消子订单
* */
export async function userRemoveChildOrderByOrderId(query) {
  return request('/order/order/userRemoveChildOrderByOrderId', {
    method: 'POST',
    body:query
  });
}

/*
 * 用户已加载过的订单
 * */
export async function userOwnedOrder(query) {
  return request('/order/order/userOwnedOrder', {
    method: 'POST',
    body:query
  });
}


/*
* 查询用户拥有订单
* */
export async function selectUserChildOrder(query) {
  return request('/order/order/selectUserChildOrder', {
    method: 'POST',
    body:query
  });
}

/*
* 用户填写订单
* */
export async function updateChildOrderRemake(query) {
  return request('/order/order/updateChildOrderRemake', {
    method: 'POST',
    body:query
  });
}
/*
* 用户注册
* */
export async function addUser(query) {
  return request('/order/user/insertuser', {
    method: 'POST',
    body:query
  });
}

/*
 * 用户修改
 * */
export async function setUser(query) {
  return request('/order/user/updateUser', {
    method: 'POST',
    body:query
  });
}

/*
 * 测试用借口
 * */
export async function ceshi(query) {
  return request('/order/msg/index', {
    method: 'POST',
    body:query
  });
}


