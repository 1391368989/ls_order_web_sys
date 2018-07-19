import { queryPowerGroup,addPowerGroupMember} from '../services/api';
export default {
  namespace: 'agentinfo',
  state: {
    powerGroupList: [],
  },

  effects: {
    *fetchTags( _, { call, put }) {
      const response = yield call(queryPowerGroup);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetch({ payload },{ call, put }){
      const response = yield call(addPowerGroupMember,payload);
      console.log(response)
      yield put({
        type: 'backtrack',
        payload: response,
      });
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        powerGroupList: action.payload.dataList,
      };
    },
    backtrack(action){
      console.log(action)
    }
  },
};

