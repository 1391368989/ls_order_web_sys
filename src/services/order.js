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
 /order/dict/selectDictByType
 通过类型查询字典表
* */
export async function selectDictByType(query) {
  return request('/order/dict/selectDictByType', {
    method: 'POST',
    body:query
  });
}

export async function getOrder(query) {
  return request('/order/order/selectOrder', {
    method: 'POST',
    body:query
  });
}
/*
* 获取菜单列表
* */
export async function getMenuData(query) {
  return request('/order/menuData', {
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
* /order/user/selectuser
 用户列表信息查询
* */
export async function selectuser() {
  return request('/order/user/selectuser', {
    method: 'POST'
  });
}
/*
* /order/role/insertRoleUserBind
 权限与用户绑定
* */
export async function insertRoleUserBind(query) {
  return request('/order/role/insertRoleUserBind', {
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

