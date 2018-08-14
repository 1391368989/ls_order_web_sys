import { queryRule, companyBind, selectTree,getRole ,toDisable ,insertRoleMenuBind,changeRoleName,
  insertRole,
  selectuser,
  changeRoleType,
  selectCompany,
  selectRoleBindCompany,
  selectAllRoleUserBind,
  insertRoleUserBind,
  deleteRoleUserBind,
  deleteRoleCompanyBind,
} from '../services/order';
import { message } from 'antd';
export default {
  namespace: 'rule',
  state: {
    data: {
      dataList: [],
      pagination: {},
    },
    treeList:[],
    userBindList:[],
    userData:{
      dataList:[],
      totalRows: 20,
      page:1,
      rows:10,
    },
    bindCompanyList:[],
    companySelectedKeys:[],
    companyData:{
      dataList:[],
      totalRows: 20,
      page:1,
      rows:10,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchTree({ payload }, { call, put }){
      const response = yield call(selectTree, payload);
      const res = yield call(getRole, payload);
      yield put({
        type: 'saveTree',
        payload: {
          dataList:response.data.dataList,
          list:res.data.dataList,
        },
      });
    },
    *disable({ payload }, { call, put }){
      yield call(toDisable, payload);
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *insertRoleMenuBind({payload},{call}){
      const response = yield call(insertRoleMenuBind, payload);
      if(response.flag === 0){
        message.success('提交成功');
      }else{
        message.success(response.msg);
      }
    },
    *changeRoleName({ payload }, { call, put }){
      yield call(changeRoleName, payload);
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *insertRole({ payload }, { call, put }){
      yield call(insertRole, payload);
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
/*    *selectuser(_,{call, put}){
      const response = yield call(selectuser);
      yield put({
        type: 'saveUserList',
        payload: response,
      });
    },*/
    *changeRoleType({ payload }, { call, put }){
      yield call(changeRoleType, payload);
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if(response.flag === 0){
        message.success('修改成功');
      }else{
        message.success(response.msg);
      }
    },
    *initCompanyModal({ payload }, { call, put }){
      const response = yield call(selectCompany, payload.selectCompany);
      const res = yield call(selectRoleBindCompany, payload.selectRoleBindCompany);
      if(res.data === null){
        res.data = {
          dataList:[]
        }
      }else if(res.data.dataList.length>0){
        let arr = res.data.dataList;
        let newArr = [];
        for (let i in arr){
          newArr.push(arr[i].key);
        }
        res.data.dataList = newArr;
      }
      yield put({
        type: 'saveCompanyList',
        payload: {
          page:response.data.page,
          bindCompanyList:res.data.dataList,
        },
      });
    },
    *pagingCompany({ payload }, { call, put }){
      const response = yield call(selectCompany, payload.selectCompany);
      yield put({
        type: 'savePagingCompanyList',
        payload: {
          page:response.data.page,
        },
      });
    },
    *fetchBindCompany({ payload }, { call, put }){
      const response = yield call(companyBind, payload);
      if(response.flag === 0){
        message.success('修改成功');
      }else{
        message.success(response.msg);
      }
    },
    *deleteRoleCompanyBind({ payload }, { call, put }){
      const response = yield call(deleteRoleCompanyBind, payload);
      if(response.flag === 0){
        message.success('修改成功');
      }else{
        message.success(response.msg);
      }
    },
    *pagingUserList({ payload }, { call, put }){
      const response = yield call(selectuser,payload);
      yield put({
        type: 'saveUserList',
        payload: {
          page:response.data.page,
        },
      });
    },
    *selectAllRoleUserBind({ payload }, { call, put }){
      const res = yield call(selectAllRoleUserBind,payload);
      if(res.data === null){
        res.data = {
          dataList:[]
        }
      }else if(res.data.dataList.length>0){
        let arr = res.data.dataList;
        let newArr = [];
        for (let i in arr){
          newArr.push(arr[i].key);
        }
        res.data.dataList = newArr;
      }
      yield put({
        type: 'saveUserBindList',
        payload: {
          userBindList:res.data.dataList,
        },
      });
    },
    *fetchBindUser({ payload }, { call, put }){
      const response = yield call(insertRoleUserBind, payload);
      if(response.flag === 0){
        message.success('修改成功');
      }else{
        message.success(response.msg);
      }
    },
   /* *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },*/
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload.data.page,
      };
    },
    saveTree(state, action) {
      return {
        ...state,
        treeList: action.payload.dataList,
        checkedKeys: action.payload.list,
      };
    },
    setCheckedKeys(state,action){
      return {
        ...state,
        checkedKeys: action.payload.checkedKeys,
      };
    },
    saveUserList(state,action){
      return {
        ...state,
        userData: action.payload.page,
      };
    },
    saveCompanyList(state,action){
      return {
        ...state,
        companyData: action.payload.page,
        bindCompanyList:action.payload.bindCompanyList
      };
    } ,
    savePagingCompanyList(state,action){
      return {
        ...state,
        companyData: action.payload.page,
      };
    },
    setBindCompanyList(state,action){
      return {
        ...state,
        bindCompanyList: action.payload.bindCompanyList
      };
    },
    setBindUserList(state,action){
      return {
        ...state,
        userBindList: action.payload.userBindList
      };
    },
    saveUserBindList(state,action){
      return {
        ...state,
        userBindList: action.payload.userBindList
      };
    },
  },
};
