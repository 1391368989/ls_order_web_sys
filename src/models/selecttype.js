import { selectDictByType } from '../services/order';

export default {
  namespace: 'selecttype',
  state: {
    statusList: [],
  },
  effects: {
    *fetch({payload},{call,put}){
      const response = yield call(selectDictByType,payload);
      yield put({
        type: 'saveList',
        payload: response,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        statusList: action.payload.data.dataList,
      };
    },
  },
};
