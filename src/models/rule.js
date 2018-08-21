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
  addUser,
  setUser,
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
    originalUserBindList:[],
    userData:{
      dataList:[],
      totalRows: 20,
      page:1,
      rows:10,
    },
    bindCompanyList:[],
    originalBindCompanyList:[],
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
      if(payload.obj.addArr.length>=1) {
        const response = yield call(companyBind, {companyIds: payload.obj.addArr, roleId: payload.roleId});
        if (response.flag === 0) {
          message.success('添加成功');
        } else {
          message.success(response.msg);
        }
      }
      if(payload.obj.delArr.length>=1) {
        const res = yield call(deleteRoleCompanyBind, {companyIds: payload.obj.delArr, roleId: payload.roleId});
        if (res.flag === 0) {
          message.success('删除成功');
        } else {
          message.success(res.msg);
        }
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
      if(payload.obj.addArr.length>=1){
        const response = yield call(insertRoleUserBind, {userIds:payload.obj.addArr,roleId:payload.roleId});
        if(response.flag === 0){
          message.success('添加成功');
        }else{
          message.success(response.msg);
        }
      }
      if(payload.obj.delArr.length>=1){
        const res = yield call(deleteRoleUserBind, {userIds:payload.obj.delArr,roleId:payload.roleId});
        if(res.flag === 0){
          message.success('删除成功');
        }else{
          message.success(res.msg);
        }
      }
    },
    *addUser({payload ,callback},{call}){
      const response = yield call(addUser, payload);
      if(response.flag === 0){
        message.success('添加成功');
        if (callback) {
          yield call(callback)
        }
      }else{
        message.success(response.msg);
      }
    },
    *setUser({payload, callback},{call}){
      const response = yield call(setUser, payload);
      if(response.flag === 0){
        message.success('修改成功');
        if (callback){
          yield call(callback)
        }
      }else{
        message.success(response.msg);
      }
    }
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
        originalBindCompanyList:action.payload.bindCompanyList,
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
        userBindList: action.payload.userBindList,
        originalUserBindList:action.payload.userBindList
      };
    },
  },
};
