import { getMenuData } from '../services/order';

export default {
  namespace: 'menu',
  state: {
    list: [],
  },
  effect: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getMenuData, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response) ? response : [],
      });
    },
  },
  reducers :{
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  }
}
