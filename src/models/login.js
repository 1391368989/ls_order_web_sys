import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { toLogin ,getImg } from '../services/login';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { setUserInfo} from  '../utils/userInfo'
import { getPageQuery } from '../utils/utils';

export default {
  namespace: 'login',
  state: {
    status: 1,
    codeImg:''
  },

  effects: {
    *login({ payload }, { call, put }) {

      const response = yield call(toLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.flag === 0) {
        setUserInfo(response.data.user);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }else{
        const res = yield call(getImg );
        yield put({
          type: 'saveImg',
          payload: res,
        });
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          flag: -2,
          msg:''
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
    *getImg({ _ },{call,put}){
      const response = yield call(getImg );
      yield put({
        type: 'saveImg',
        payload: response,
      });
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if(payload.flag === 0){
        //登录成功
        setAuthority('user');
      }else {
        //退出登录
        setAuthority('guest');
      }
      return {
        ...state,
        status: payload.flag,
        type: payload.msg,
      };
    },
    saveImg(state, { payload }){
      return {
        ...state,
        codeImg: payload,
      };
    }
  },
};
