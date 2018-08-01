import { getOrderChartData} from '../services/api';
export default {
  namespace: 'workplace',
  state: {
    chartData: null,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(getOrderChartData, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        chartData: action.payload.dataList,
      };
    }
  },
};

