import request from '../utils/request';

export async function getProvince() {
  return request('/order/city/selectProvince', {
    method: 'POST'
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
