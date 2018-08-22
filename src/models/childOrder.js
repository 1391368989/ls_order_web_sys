import { selectChildOrder,selectDictByType} from '../services/order';
import { message } from 'antd';
export default {
  namespace: 'childOrder',
  state: {
    childOrderPage: {
      dataList:[],
    },
    statusList:[]
  },

  effects: {
    *childOrderList({payload}, { call, put }) {
      console.log(payload);
      const response = yield call(selectChildOrder,payload);
      yield put({
        type: 'savePage',
        payload: response,
      });
    },
    *fetch({payload},{call,put}){
      const response = yield call(selectDictByType,payload);
      yield put({
        type: 'init',
        payload: response,
      });
    },
  },

  reducers: {
    savePage(state, action) {
      return {
        ...state,
        childOrderPage: action.payload.data.page,
      };
    },
    init(state, action) {
      return {
        ...state,
        statusList: action.payload.data.dataList,
      };
    }
  }
}

