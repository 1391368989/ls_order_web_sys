import { message } from 'antd';
import { selectDrawings, agreeDrawings, rejectDrawings, updateAccountShopStatue} from '../services/order';

export default {
  namespace: 'finance',

  state: {
    detailedPage:{}
  },

  effects: {
    *fetchDetailed({payload},{call,put}){
      const response = yield call(selectDrawings, payload);
      yield put({
        type: 'saveDetailedPage',
        payload: response,
      });
    },
    //提现审核
    *operationAgree({payload,callback},{call}){
      const response = yield call(agreeDrawings, payload);
      if(response.flag === 0){
        message.success('操作成功');
        if(callback)callback()
      }else{
        message.error(response.msg);
      }
    },
    //提现驳回
    *operationReject({payload,callback},{call}){
      const response = yield call(rejectDrawings, payload);
      if(response.flag === 0){
        message.success('操作成功');
        if(callback)callback()
      }else{
        message.error(response.msg);
      }
    },
    // 已打款
    *updateAccountShopStatue({payload,callback},{call}){
      const response = yield call(updateAccountShopStatue, payload);
      if(response.flag === 0){
        message.success('操作成功');
        if(callback)callback()
      }else{
        message.error(response.msg);
      }
    },
  },

  reducers: {
    saveDetailedPage(state, { payload }) {
      return {
        ...state,
        detailedPage:payload.data.page
      };
    },
  },
};
