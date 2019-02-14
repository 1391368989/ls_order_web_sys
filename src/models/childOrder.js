import { selectChildOrder,selectDictByType,platformAgreeChildOrder,platformRefuseChildOrder,merchantRefuseChildOrder,merchantAgreeChildOrder,
  merchantAgreeChildOrders,//商家批量同意订单
  merchantRefuseChildOrders,//商家批量拒绝订单
  platformAgreeChildOrders,//平台批量同意订单
  platformRefuseChildOrders,//平台批量拒绝订单
  merchantReviewChildOrder,//商家撤销操作
  reviewChildOrder,//平台撤销操作
} from '../services/order';
import { message } from 'antd';
export default {
  namespace: 'childOrder',
  state: {
    childOrderPage: {
      dataList:[],
    },
    statusList:[]
  },

  effects: {
    *childOrderList({payload}, { call, put }) {
      const response = yield call(selectChildOrder,payload);
      yield put({
        type: 'savePage',
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
    *revoke({payload,callback},{call}){
      let response;
      switch(payload.type)
      {
        case 1:
          //商家撤销操作
          response = yield call(merchantReviewChildOrder,payload.query);
          break;
        case 2:
          //平台撤销操作
          response = yield call(reviewChildOrder,payload.query);
          break;
      }
      if(response.flag === 0){
        message.success('操作成功');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },
    *batchOperation({payload,callback},{call}){
      let response;
      switch(payload.type)
      {
        case 1:
          //平台审核批量同意该订单
          response = yield call(platformAgreeChildOrders,payload.query);
          break;
        case 2:
          //平台审核批量不同意该订单
          response = yield call(platformRefuseChildOrders,payload.query);
          break;
        case 3:
          //商家审核批量通过订单
          response = yield call(merchantAgreeChildOrders,payload.query);
          break;
        case 4:
          //商家审核批量不通过订单
          response = yield call(merchantRefuseChildOrders,payload.query);
          break;
      }
      if(response.flag === 0){
        message.success('操作成功');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },
    *operation({payload,callback},{call}){
      let response;
      switch(payload.type)
      {
        case 1:
          //平台审核同意该订单
          response = yield call(platformAgreeChildOrder,payload.query);
          break;
        case 2:
          //平台审核不同意该订单
          response = yield call(platformRefuseChildOrder,payload.query);
          break;
        case 3:
          //商家审核通过订单
          response = yield call(merchantAgreeChildOrder,payload.query);
          break;
        case 4:
          //商家审核不通过订单
          response = yield call(merchantRefuseChildOrder,payload.query);
          break;
      }
      if(response.flag === 0){
        message.success('操作成功');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },
    /**fetchAuditingAdopt({payload,callback},{call}){
      const response = yield call(platformAgreeChildOrder,payload);
      if(response.flag === 0){
        message.success('操作成功（通过）');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },
    *fetchAuditingNoAdopt({payload,callback},{call}){
      const response = yield call(platformRefuseChildOrder,payload);
      if(response.flag === 0){
        message.success('操作成功（不通过）');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },
    //商家审核通过
    *fetchAgentAuditingAdopt({payload,callback},{call}){
      const response = yield call(merchantAgreeChildOrder,payload);
      if(response.flag === 0){
        message.success('操作成功（通过）');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },
    //商家审核不通过
    *fetchAgentAuditingNoAdopt({payload,callback},{call}){
      const response = yield call(merchantRefuseChildOrder,payload);
      if(response.flag === 0){
        message.success('操作成功（通过）');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },*/
  },

  reducers: {
    savePage(state, action) {
      return {
        ...state,
        childOrderPage: action.payload.data.page,
      };
    },
    init(state, action) {
      return {
        ...state,
        statusList: action.payload.data.dataList,
      };
    }
  }
}

