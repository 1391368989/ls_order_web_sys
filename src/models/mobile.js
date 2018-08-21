import { saveUserInfo, getOrderList,insertChildOrder ,userOwnedOrder, userRemoveChildOrderByOrderId ,updateChildOrderRemake} from '../services/order';
import { message } from 'antd';
export default {
  namespace: 'mobile',
  state: {
    step: 1,
    orderPage:{
      dataList:[],
    },
    query:{
      "page": 0,
      "rows": 0,
      "totalRows": 0
    },
    userOrderList:[],
  },
  effects: {
    *saveUserInfo({ payload ,callback  }, { call, put }) {
      const response = yield call(saveUserInfo, payload);
      if(response.flag === 0){
        if (callback && typeof callback === 'function') callback();
      }else{
        message.success(response.msg);
      }
    },
    *pagingOrder({payload ,callback},{ call, put }){
      const response = yield call(getOrderList,payload);
      if(response.flag === 0){
        if (callback && typeof callback === 'function') callback();
        yield put({
          type: 'saveOrderList',
          payload: response,
        });

      }
    },
    *insertChildOrder({payload, callback},{ call }){
      const response = yield call(insertChildOrder,payload);
      if (response.flag === 0) {
        message.success('已抢到订单，您有10分钟的填写时间！');
        if (callback && typeof callback === 'function') callback();
      }else{
        message.success(response.msg);
      }
    },
    *userRemoveChildOrderByOrderId({payload, callback },{ call}){
      const response = yield call(userRemoveChildOrderByOrderId,payload);
      if (response.flag === 0) {
        message.success('您取消了当前订单!');
        if (callback && typeof callback === 'function') callback();
      }else{
        message.success(response.msg);
      }
    },
    *userOwnedOrder({payload},{ call, put }){
      const response = yield call(userOwnedOrder,payload);
      if(response.data&&response.flag === 0){
        yield put({
          type: 'saveUserOrderList',
          payload: response,
        });
      }
    },
    *submitData({payload,callback},{ call }){
      console.log(payload)
      const response = yield call(updateChildOrderRemake,payload);
      console.log(response)
      if (response.flag === 0) {
        message.success('成功提交订单!');
        if (callback && typeof callback === 'function') callback();
      }else{
        message.success(response.msg);
      }
    },

  },
  reducers: {
    saveOrderList(state, action) {
      return {
        ...state,
        orderPage: action.payload.data.page,
      };
    },
    saveUserOrderList(state, action){
      return {
        ...state,
        userOrderList: action.payload.data.dataList,
      };
    }
  },
};
