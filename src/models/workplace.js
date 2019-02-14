import { getOrderChartData} from '../services/api';
import { getUserCompany,selectChildOrderAgencyPrice,
  selectChildOrderAgencyPriceGroup,
  selectAgencyPriceLineChart,
  selectDrawingsPrice,
  insertDrawings,
} from '../services/order';
import { message } from 'antd';
export default {
  namespace: 'workplace',
  state: {
    chartData: null,
    companyPage:{},
    totalIncome:0,
    alreadyPresented:0,
  },
  effects: {
    *fetchTotalIncome({payload},{call,put}){//代理商总收益
      const response = yield call(selectChildOrderAgencyPrice, payload);
       yield put({
       type: 'saveTotalIncome',
       payload: response,
       });
    },
    *fetchAlreadyPresented({payload},{call,put}){//代理商已提现金额
      const response = yield call(selectDrawingsPrice, payload);
      yield put({
        type: 'saveAlreadyPresented',
        payload: response,
      });
    },
    *fetchSearch({ payload }, { call, put }) {
      const response = yield call(selectAgencyPriceLineChart, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *insertDrawings({ payload,callback }, { call }){
      const response = yield call(insertDrawings, payload);
      if(response.flag === 0){
        message.success('提现申请提交成功');
        if(callback){callback()}
      }else{
        message.success(response.msg);
      }
    },
    *init({ payload }, { call, put }){
      const response = yield call(getUserCompany, payload);
      yield put({
        type: 'saveCompanyList',
        payload: response,
      });
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        chartData: action.payload.data.dataList,
      };
    },
    saveCompanyList(state, action) {
      return {
        ...state,
        companyPage: action.payload.data.page,
      };
    },
    saveTotalIncome(state, action) {
      return {
        ...state,
        totalIncome: action.payload.data.price,
      };
    },
    saveAlreadyPresented(state, action) {
      return {
        ...state,
        alreadyPresented: action.payload.data.drawingsPrice,
      };
    },
  },
};

