import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider , Modal, Tree,Badge,Pagination} from 'antd';
import UserBind from './UserBind'
import CompanyBind from './CompanyBind'
import { connect } from 'dva';
import styles from './style.less';

const TreeNode = Tree.TreeNode;
const status= ['已禁用','活动中'];
const statusMap = ['error', 'success'];
@connect(({ rule ,loading }) => ({
  rule,
  loading: loading.models.rule,
}))
export default class TableForm extends PureComponent {
  index = 0;
  cacheOriginData = {};
  state ={
    autoExpandParent: true,
    checkedKeys: null,
    selectedKeys: ['1'],
    loading: false,
    roleId:null,
    visibleMember:false,
    visible:false,
    visibleCompanyBind:false,
    selectCompany:{
      search_id_NIN:[],
      page_rows:10,
      page_page:2,
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
      });
    }
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.id === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);

    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };

      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };
  addRow = (e,id)=>{
    e.persist();
    const { dispatch } = this.props;
    const target = this.getRowByKey(id) || {};
    dispatch({
      type: 'rule/insertRole',
      payload:{
        "parentId": 0,
        "type": 0,
        name:target.name
      }
    });
    this.toggleEditable(e, id);
  };
  saveRow =(e, key) => {
    e.persist();
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if ( !target.name) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      const { data } = this.state;
      delete target.isNew;
      this.toggleEditable(e, key);
      this.setState({
        loading: false,
      });
      const { dispatch } = this.props;
      dispatch({
        type: 'rule/changeRoleName',
        payload:{
          id:target.id,
          name:target.name
        }
      });
    }, 500);
  }
  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      id: `新建权限组${this.index+1}`,
      workId: '',
      name: '',
      department: '',
      editable: true,
      isNew: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  };
  disable (item){
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/disable',
      payload:{
        id: item.id,
        status: item.status? 0 : 1
      }
    });
  };
  remove(id) {
    const { data } = this.state;
    const newData = data.filter(item => item.id !== id);
    this.setState({ data: newData });
  }
  changeRoleType =(item)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/changeRoleType',
      payload:{
        id: item.id,
        type: item.type? 0 : 1
      }
    });
  };
  handleKeyPress(e, key) {
    if (e.key === 'Enter') {
      this.saveRow(e, key);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }


  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }
  renderPowerMenu(){
    const { rule } = this.props;
    const { treeList , checkedKeys} = rule;
    this.state.checkedKeys = checkedKeys;
    return (
      <Tree
        checkable
        onExpand={this.onExpand}
        expandedKeys={this.state.expandedKeys}
        autoExpandParent={this.state.autoExpandParent}
        defaultExpandAll={true}
        onCheck={this.onCheck}
        checkedKeys={this.state.checkedKeys}
        onSelect={this.onSelect}
        selectedKeys={this.state.selectedKeys}
        checkStrictly ={true}
      >
        {this.renderTreeNodes(treeList)}
      </Tree>
    );
  };
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.menuVOS === null) item.menuVOS = [];
      if (item.menuVOS) {
        return (
          <TreeNode title={item.name} key={item.id} dataRef={item}>
            {this.renderTreeNodes(item.menuVOS)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  };
  onExpand = (expandedKeys) => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
  onCheck = (checkedKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/setCheckedKeys',
      payload:{
        checkedKeys:checkedKeys
      }
    });
  };
  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  showModal = (id) => {
    this.setState({
      visible: true,
      roleId:id
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetchTree',
      payload:{
        roleId:id
      }
    });
  };
  showModalMember = (id) =>{
    this.setState({
      visibleMember: true,
      roleId:id
    });
    //获取所有成员

    const { dispatch } = this.props;
    dispatch({
      type: 'rule/pagingUserList',
      payload:{
        page_rows:10,
        page_page:1,
      }
    });
    dispatch({
      type: 'rule/selectAllRoleUserBind',
      payload:{
        roleId:id
      }
    });
  };
  handleOk = () => {
    const { dispatch } = this.props;
    if(this.state.checkedKeys.checked === undefined||this.state.checkedKeys.checked.length<1){
      this.setState({
        visible: false,
      });
      return;
    }
    dispatch({
      type: 'rule/insertRoleMenuBind',
      payload:{
        roleId:this.state.roleId,
        menuIds:this.state.checkedKeys.checked
      }
    });
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  };

  handleMemberOk = () => {
    this.setState({
      visibleMember: false,
    });
    const { dispatch ,rule } = this.props;
    const {userBindList,originalUserBindList} = rule;
    const obj = this.filtration(originalUserBindList,userBindList);
    //userIds
    dispatch({
      type: 'rule/fetchBindUser',
      payload:{
        obj,
        "roleId": this.state.roleId
      }
    });
  };

  handleMemberCancel = (e) => {
    this.setState({
      visibleMember: false,
    });
  };
  showModalCompanyBind =(id) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/initCompanyModal',
      payload:{
        selectCompany:{
          page_rows:10,
          page_page:1,
          search_id_NIN:[]
        },
        selectRoleBindCompany:{
          "roleId": id
        }
      }
    });
    this.setState({
      visibleCompanyBind: true,
      roleId:id
    });
  };
  filtration(data,newData){
    let delArr = [] ,addArr =[];
    for (let i in newData){
      let str = newData[i];
      if(data.indexOf(str)<0){
        addArr.push(str);
      }
    }
    for (let i in data){
      let str = data[i];
      if(newData.indexOf(str)<0){
        delArr.push(str);
      }
    }
    return {
      delArr,
      addArr
    }
  };
  handleCompanyBindOk = () => {
    this.setState({
      visibleCompanyBind: false,
    });
    const { dispatch ,rule } = this.props;
    const {bindCompanyList ,originalBindCompanyList} = rule;
    const obj = this.filtration(originalBindCompanyList,bindCompanyList);
    dispatch({
      type: 'rule/fetchBindCompany',
      payload:{
        obj,
        "roleId": this.state.roleId
      }
    });
  };
  handleCompanyBindCancel = (e) => {
    this.setState({
      visibleCompanyBind: false,
    });
  };

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        render: (text, record) => {
          return record.id;
        },
      },
      {
        title: '权限组名',
        dataIndex: 'name',
        key: 'name',
        width:'18%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'name', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record.id)}
                placeholder="权限组名"
              />
            );
          }
          return text;
        },
      },
      {
        title: '组状态',
        dataIndex: 'status',
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          }
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.addRow(e, record.id)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除当前权限组？" onConfirm={() => this.remove(record.id)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.id)}>保存</a>
                  <Divider type="vertical" />
                 <a onClick={e => this.cancel(e, record.id)}>取消</a>
                <Divider type="vertical" />
                  <Popconfirm title="是否要禁用当前权限组？" onConfirm={() => this.remove(record.key)}>
                    <a>禁用</a>
                  </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.id)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title={`是否要${record.status?'禁用':'启用'}当前权限组？`} onConfirm={() => this.disable(record)}>
                <a>{record.status === 1&&'禁用'}</a>
                <a>{record.status === 0&&'启用'}</a>
              </Popconfirm>
              <Divider type="vertical" />
               <a onClick={e => this.showModal(record.id)}>设置权限</a>
               <Divider type="vertical" />
               <a onClick={e => this.showModalMember(record.id)}>管理成员</a>
               <Divider type="vertical" />
               <Popconfirm title={`是否${record.type?'禁用':'启用'}绑定商家？`} onConfirm={() => this.changeRoleType(record)}>
                  <a>{record.type === 1&&'禁用绑定商家'}</a>
                  <a>{record.type === 0&&'启用绑定商家'}</a>
               </Popconfirm>
              {record.type === 1&&
                <span>
                  <Divider type="vertical" />
                  <a onClick={e => this.showModalCompanyBind(record.id)}>绑定商家</a>
                </span>
              }
            </span>
          );
        },
      },
    ];
    const {  data } = this.state;
    const { loading} = this.props;
    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={true}
          rowKey={record => record.id}
          rowClassName={record => {
            return record.editable ? styles.editable : '';
          }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增权限组
        </Button>
        <Modal
          title="权限设置"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose ={true}
        >
          {this.state.visible&&this.renderPowerMenu()}
        </Modal>
        <Modal
          title="成员设置"
          visible={this.state.visibleMember}
          onOk={this.handleMemberOk}
          onCancel={this.handleMemberCancel}
          destroyOnClose ={true}
          width={'800px'}
        >
          {this.state.visibleMember&&<UserBind/>}
        </Modal>
        <Modal
          title="商家设置"
          visible={this.state.visibleCompanyBind}
          onOk={this.handleCompanyBindOk}
          onCancel={this.handleCompanyBindCancel}
          destroyOnClose ={true}
          width={'800px'}
        >
          {this.state.visibleCompanyBind&&<CompanyBind/>}
        </Modal>
      </Fragment>
    );
  }
}
