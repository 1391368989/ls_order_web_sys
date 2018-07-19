import { queryPowerGroup,addPowerGroupMember} from '../services/api';
import { message } from 'antd';
export default {
  namespace: 'agentinfo',
  state: {
    powerGroupList: [],
    loading:false,
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
      yield put({
        type: 'backtrack',
        payload: response,
      });
      message.success('提交成功');
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        powerGroupList: action.payload.dataList,
      };
    },
    backtrack(state,action){
      return {
        ...state
      };
    }
  },
};

