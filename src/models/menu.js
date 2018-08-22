/*import { getMenuData  } from '../services/api';*/
import { getTree ,getMenuData } from '../services/order';

export default {
  namespace: 'menu',
  state: {
    list: [],
    menuList:[],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMenuData, payload);
      let list = [];
      if(response.data){
        list = response.data.dataList
      }

      yield put({
        type: 'queryList',
        payload: list,
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
      console.log(action);
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
