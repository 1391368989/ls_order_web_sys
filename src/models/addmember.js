import {getProvince,getCity,getDistrict,insertCompany ,selectDictByType,updateCompany} from '../services/order'
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

    *getCity({ payload ,callback},{ call }){
      const response = yield call(getCity,payload);
      if(response.flag===0&&callback){
        callback(response)
      }
    },
    *getDistrict({ payload ,callback },{ call }){
      const response = yield call(getDistrict,payload);
      if(response.flag===0&&callback){
        callback(response)
      }
    },
    *setCompany({ payload ,callback},{ call, put }){
      const response = yield call(updateCompany,payload);
      yield put({
        type: 'backtrack',
        payload: response,
      });
      if(response.flag === 0){
        message.success('修改成功');

      }else{
        message.success(response.msg);
      }
    },
    *fetch({ payload,callback },{ call, put }){
      let response;
      if(payload.type ==='set'){
        response = yield call(updateCompany,payload.values);
      }else{
        response = yield call(insertCompany,payload.values);
      }
      if(response.flag === 0){
        message.success('提交成功');
        if(callback)callback()
      }else{
        message.success(response.msg);
      }
    }
  },

  reducers: {
    backtrack(state){
      return {
        ...state
      };
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

