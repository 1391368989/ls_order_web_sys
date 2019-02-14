import { getOrder,selectDictByType,addOrder,selectCompany, insertOrderCompanyBind,selectOrderIdByOrderId ,deleteOrderCompanyBind, interruptOrder,
  insertOrders,
  getOrderByCompany,
  finishOrder,
  deleteOrder,
  accomplishOrder,
  updateOrder,
  accountShop,
  downloadExport,
} from '../services/order';
import { message } from 'antd';
import {getAuthority} from '../utils/utils';
export default {
  namespace: 'order',
  state: {
    orderPage: {
      dataList:[],
    },
    orderAccountShopPage: {
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
      let response ;
      if(getAuthority('/order/order/selectOrder')){
        response = yield call(getOrder,payload);
      }else{
        response = yield call(getOrderByCompany,payload);
      }
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
      let response;
      if(payload.id){
        response = yield call(updateOrder,payload);
      }else{
        response = yield call(addOrder,payload);
      }

      if(response.flag === 0){
        if(payload.id){
          message.success('修改成功');
        }else{
          message.success('添加成功');
        }
      }else{
        message.error(response.msg);
      }
    },
    *insertOrders({payload,callback},{call}){
      const response = yield call(insertOrders,payload);
      if(response.flag === 0){
        message.success('批量添加成功');
        if(callback)callback();
      }else{
        message.error(response.msg);
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
        message.error(response.msg);
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
        message.error(response.msg);
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
        message.error(response.msg);
      }
    },
    *operationFinishOrder({payload, callback},{call}){
      const response = yield call(finishOrder,payload);
      if(response.flag === 0){
        message.success('订单节算完成');
        if(callback){callback()}
      }else{
        message.error(response.msg);
      }
    },
    *operationDeleteOrder({payload, callback},{call}){
      const response = yield call(deleteOrder,payload);
      if(response.flag === 0){
        message.success('订单删除成功');
        if(callback){callback()}
      }else{
        message.error(response.msg);
      }
    },
    *operationAccomplishOrder({payload, callback},{call}){
      const response = yield call(accomplishOrder,payload);
      if(response.flag === 0){
        message.success('订单已停止');
        if(callback){callback()}
      }else{
        message.error(response.msg);
      }
    },
    // 查询商家核算订单fetch
    *fetchAccountShopList({payload, callback},{call,put}){
      const response = yield call(accountShop,payload);
      if(response.flag === 0){
        yield put({
          type: 'saveOrderAccountShopPage',
          payload: response,
        });
      }else{
        message.error(response.msg);
      }
    },
    *downloadExport({payload},{call}){
      const response = yield call(downloadExport,payload);
      let url = window.URL.createObjectURL(response);
      if(response.flag === 0){

      }else{
    /*    var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);   // 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
        var filename = res.headers.get('Content-Disposition');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);*/
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
    saveOrderAccountShopPage(state, action) {
      return {
        ...state,
        orderAccountShopPage: action.payload.data.page,
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

