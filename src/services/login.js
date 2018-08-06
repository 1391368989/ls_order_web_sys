import { stringify } from 'qs';
import request from '../utils/request';

export async function toLogin(query) {
  return request('/loginUser', {
    method: 'POST',
    body:query
  });
}
