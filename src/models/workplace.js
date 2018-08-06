import { getOrderChartData} from '../services/api';
export default {
  namespace: 'workplace',
  state: {
    chartData: null,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      console.log('干活了');
      const response = yield call(getOrderChartData, payload);
      console.log(response);
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

