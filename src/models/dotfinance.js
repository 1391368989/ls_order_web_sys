import { message } from 'antd';
import { selectCompanyReception, selectChildOrder, insertCompanyReception,reviewCompanyReception,commitCompanyReceptions} from '../services/order';

export default {
  namespace: 'dotfinance',
  state: {
    dataPage:{
      dataList:[],
    },
    childDataPage:{
      dataList:[],
    }
  },

  effects: {
    *fetch({payload,callback},{call,put}){
      const response = yield call(selectCompanyReception, payload);
      if(response.flag === 0){
        if(callback)callback(response);
      }
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchChildOrder({payload},{call,put}){
      const response = yield call(selectChildOrder, payload);
      yield put({
        type: 'saveChildData',
        payload: response,
      });
    },
    *submit({payload,callback},{call}){
      const response = yield call(insertCompanyReception, payload);
      if(response.flag === 0){
        message.success('保存成功');
        if(callback)callback(response);
      }else{
        message.error(response.msg);
      }
    },
    //进入编辑
    *operation({payload,callback},{call}){
      const response = yield call(reviewCompanyReception, payload);
      if(response.flag === 0){
        message.success('操作成功');
        if(callback)callback(response);
      }else{
        message.error(response.msg);
      }
    },
    *operationReception({payload,callback},{call}){
      const response = yield call(reviewCompanyReception, payload);
      if(response.flag === 0){
        message.success('操作成功');
        if(callback)callback(response);
      }else{
        message.error(response.msg);
      }
    },
    //提交报销
    *operationOnSubmit({payload,callback},{call}){
      const response = yield call(commitCompanyReceptions, payload);
      if(response.flag === 0){
        message.success('操作成功');
        if(callback)callback(response);
      }else{
        message.error(response.msg);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        dataPage:payload.data.page
      };
    },
    saveChildData(state, { payload }) {
      return {
        ...state,
        childDataPage:payload.data.page
      };
    },
  },
};
