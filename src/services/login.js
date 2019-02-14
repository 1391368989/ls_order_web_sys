import request from '../utils/request';

export async function toLogin(query) {
  return request('/loginUser', {
    method: 'POST',
    body:query
  });
}

export async function getImg() {
  return request('/getVerify');
}
