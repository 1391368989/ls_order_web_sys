import request from '../utils/request';
export async function getImg(params) {
  return request('/createSecurityCode',{
    body:params,
    method:'GET'
  });
}
