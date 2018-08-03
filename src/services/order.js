import { stringify } from 'qs';
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
