import {getProvince,getCity,getDistrict,insertCompany ,selectDictByType} from '../services/order'
import { message } from 'antd';
export default {
  namespace: 'addmember',
  state: {
    powerGroupList: [],
    provinceList: [],
    cityList:[],
    districtList:[],
    loading:false,
  },

  effects: {
    *fetchTags({payload}, { call, put }) {
      const response = yield call(selectDictByType,payload);
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
    *getCity({ payload },{ call, put }){
      const response = yield call(getCity,payload);
      yield put({
        type: 'saveCity',
        payload: response,
      });
    },
    *getDistrict({ payload },{ call, put }){
      const response = yield call(getDistrict,payload);
      yield put({
        type: 'saveDistrict',
        payload: response,
      });
    },
    *fetch({ payload },{ call, put }){
      const response = yield call(insertCompany,payload);
      yield put({
        type: 'backtrack',
        payload: response,
      });
      if(response.flag === 0){
        message.success('提交成功');
      }else{
        message.success(response.msg);
      }
    }
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        powerGroupList: action.payload.data.dataList,
      };
    },
    backtrack(state){
      return {
        ...state
      };
    },
    province(state,action){
      return{
        ...state,
        provinceList: action.payload.data.dataList,
      }
    },
    saveCity(state,action){
      return{
        ...state,
        cityList: action.payload.data.dataList,
      }
    },
    saveDistrict(state,action){
      return{
        ...state,
        districtList: action.payload.data.dataList,
      }
    }
  },
};

