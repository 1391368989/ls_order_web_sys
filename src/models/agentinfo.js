import { queryPowerGroup,addPowerGroupMember} from '../services/api';
import { selectCompany ,ceshi,getProvince,selectDictByType} from '../services/order';
import { message } from 'antd';
export default {
  namespace: 'agentinfo',
  state: {
    powerGroupList: [],
    loading:false,
    dataPage:{
      dataList:[],
    },
    provinceList:[],
  },

  effects: {
    *fetchTags( _, { call, put }) {
      const response = yield call(queryPowerGroup);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchInit({ payload}, { call, put }) {
      const req = yield call(selectDictByType,payload);
      yield put({
        type: 'saveType',
        payload: req,
      });
      const res = yield call(getProvince);
      yield put({
        type: 'province',
        payload: res,
      });
    },
    *ceshi({ payload ,callback}, { call, put }) {
      const response = yield call(ceshi,payload);
      if(response){
        if (callback) {
          callback(response)
        }
      }
    },
    *fetchCompany({ payload },{ call, put }){
      const response = yield call(selectCompany,payload);
      yield put({
        type: 'saveCompanyPage',
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
    saveType(state, action) {
      return {
        ...state,
        powerGroupList: action.payload.data.dataList,
      };
    },
    province(state,action){
      return{
        ...state,
        provinceList: action.payload.data.dataList,
      }
    },
    backtrack(state,action){
      return {
        ...state
      };
    } ,
    saveCompanyPage(state,action){
      return {
        ...state,
        dataPage:action.payload.data.page
      };
    }
  },
};

