/*import { getMenuData  } from '../services/api';
import { getTree } from '../services/order';*/
import { getTree ,getMenuData } from '../services/order';
import { filterMenu }from '../utils/utils'
export default {
  namespace: 'menu',
  state: {
    list: [],
    menuList:[],
  },
  effects: {
    /**fetch({ payload }, { call, put }) {
      const response = yield call(getMenuData, payload);

      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },*/
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMenuData, payload);
      let list = [];
      if(response.data){
        list = filterMenu(response.data.dataList);
      }
      yield put({
        type: 'queryList',
        payload: Array.isArray(list) ? list : [],
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
