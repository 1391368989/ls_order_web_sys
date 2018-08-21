import { getMenuData  } from '../services/api';
import { getTree  } from '../services/order';

export default {
  namespace: 'menu',
  state: {
    list: [],
    menuList:[],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMenuData, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
    *fetchTree(_, { call, put }){
      const response = yield call(getTree);
      yield put({
        type: 'saveMenuList',
        payload: response
      });
    },
  },
  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveMenuList(state, action) {
      return {
        ...state,
        menuList: action.payload.data.dataList,
      };
    },
  },
};
