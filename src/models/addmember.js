import { queryPowerGroup,addPowerGroupMember} from '../services/api';
import {getProvince} from '../services/order'
import { message } from 'antd';
export default {
  namespace: 'addmember',
  state: {
    powerGroupList: [],
    provinceList: [],
    loading:false,
  },

  effects: {
    *fetchTags( _, { call, put }) {
      const response = yield call(queryPowerGroup);
      yield put({
        type: 'save',
        payload: response,
      });
      const res = yield call(getProvince);
      yield put({
        type: 'province',
        payload: res,
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
    },
    province(state,action){
      return{
        ...state,
        provinceList: action.payload.data.dataList,
      }
    }
  },
};

