import { getOrder,selectDictByType,addOrder,selectCompany, insertOrderCompanyBind,selectOrderIdByOrderId ,deleteOrderCompanyBind, interruptOrder} from '../services/order';
import { message } from 'antd';
export default {
  namespace: 'order',
  state: {
    orderPage: {
      dataList:[],
    },
    loading:false,
    statusList:[],
    companyPage:{
      dataList:[],
    },
    orderIdByOrderIdList:[],
  },

  effects: {
    *orderList({payload}, { call, put }) {
      const response = yield call(getOrder,payload);
      yield put({
        type: 'savePage',
        payload: response,
      });
    },
    *companyList({payload}, { call, put }) {
      const response = yield call(selectCompany,payload);
      yield put({
        type: 'saveCompanyPage',
        payload: response,
      });
    },
    *fetch({payload},{call,put}){
      const response = yield call(selectDictByType,payload);
      yield put({
        type: 'init',
        payload: response,
      });
    },
    *fetchAdd({payload},{call}){
      const response = yield call(addOrder,payload.values);
      if(response.flag === 0){
        message.success('添加成功');
      }else{
        message.success(response.msg);
      }
    },
    *companyBind({payload},{call,put}){
      const response = yield call(insertOrderCompanyBind,payload);
      if(response.flag === 0){
        message.success('添加成功');
        yield put({
          type: 'addOrderIdByOrderId',
          payload: payload,
        });
      }else{
        message.success(response.msg);
      }
    },
    *removeCompanyBind({payload},{call,put}){
      const response = yield call(deleteOrderCompanyBind,payload);
      if(response.flag === 0){
        message.success('解除绑定成功');
        yield put({
          type: 'removeOrderIdByOrderId',
          payload: payload,
        });

      }else{
        message.success(response.msg);
      }
    },
    *selectOrderIdByOrderId({payload},{call, put}){
      const response = yield call(selectOrderIdByOrderId,payload);
      yield put({
        type: 'saveOrderIdByOrderId',
        payload: response,
      });
    },
    *interruptOrder({payload, callback},{call}){
      const response = yield call(interruptOrder,payload);
      if(response.flag === 0){
        message.success('订单下架成功');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },
  },

  reducers: {
    savePage(state, action) {
      return {
        ...state,
        orderPage: action.payload.data.page,
      };
    },
    saveCompanyPage(state, action) {
      return {
        ...state,
        companyPage: action.payload.data.page,
      };
    },
    saveOrderIdByOrderId(state, action) {
      return {
        ...state,
        orderIdByOrderIdList: action.payload.data.dataList,
      };
    },
    addOrderIdByOrderId(state, action) {
      let orderIdByOrderIdList = state.orderIdByOrderIdList;
      orderIdByOrderIdList.push(action.payload);
      return {
        ...state,
        orderIdByOrderIdList: orderIdByOrderIdList,
      };
    },
    removeOrderIdByOrderId(state, action) {
      let orderIdByOrderIdList = state.orderIdByOrderIdList;
      for (let i in orderIdByOrderIdList){
        if(orderIdByOrderIdList[i].companyId === action.payload.companyId ){
          orderIdByOrderIdList.splice(i, 1);
          break
        }
      }
      return {
        ...state,
        orderIdByOrderIdList: orderIdByOrderIdList,
      };
    },
    init(state, action) {
      return {
        ...state,
        statusList: action.payload.data.dataList,
      };
    }
  },
};

