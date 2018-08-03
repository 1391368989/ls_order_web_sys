import { getOrder } from '../services/order';
import { message } from 'antd';
export default {
  namespace: 'order',
  state: {
    orderList: [],
    loading:false,
  },

  effects: {
    *orderList( {payload}, { call, put }) {
      const response = yield call(getOrder,payload);
      yield put({
        type: 'init',
        payload: response,
      });
    }
  },

  reducers: {
    init(state, action) {
      return {
        ...state,
        orderList: action.payload.dataList,
      };
    }
  },
};

