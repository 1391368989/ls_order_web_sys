import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider,  } from 'antd';
import { connect } from 'dva';
import {validatePhone} from '../../utils/utils'
import styles from './style.less';

@connect(({ rule ,loading }) => ({
  rule,
  loading: loading.effects['rule/pagingUserList'],
}))
export default class TableForm extends PureComponent {
  index = 0;
  cacheOriginData = {};
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      userData:props.rule.userData
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
    return (newData || data).filter(item => item.key === key)[0];
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

  newMember = () => {
    const { data,userData} = this.state;
    const newData = data.map(item => ({ ...item }));
    let newUserData = userData;
    newData.push({
      key: `新增成员${this.index}`,
      editable: true,
      isNew: true,
    });
    this.index += 1;
    if(newUserData.rows>=newUserData.totalRows&&newUserData.page<=newUserData.totalPage){
      newUserData.totalRows++;
    }
    this.setState({ data: newData,userData:newUserData });
  };

  remove(key) {
    const { data } = this.state;
    const { onChange} = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

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

  saveRow =(e, key ,id)=> {
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
      if (!target.userName || !target.userSex || !target.userPhone || !target.userPassword || !target.userAddress || !target.userBankCard) {
        message.error('请填写完整成员信息。');
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }else if(validatePhone(target.userPhone)){
        e.target.focus();
        this.setState({
          loading: false,
        });
        return;
      }
      const { dispatch,onInit } = this.props;
      this.setState({
        loading: false,
      });
      if(id){
        dispatch({
          type: 'rule/setUser',
          payload:{
            id,
            ...target
          },
          callback:()=>{
            onInit()
          }
        });
      }else{
        dispatch({
          type: 'rule/addUser',
          payload:{
            ...target
          },
          callback:()=>{
            onInit()
          }
        });
      }

    }, 500);
  };

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
  toPagination=(e)=>{
    const {onToPagination} = this.props;
    onToPagination(e.current)
  };
  render() {
    const columns = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
        width:'10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'userName', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入姓名！"
                maxLength={6}
              />
            );
          }
          return text;
        },
      },
      {
        title: '性别',
        dataIndex: 'userSex',
        key: 'userSex',
        width:'8%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                onChange={e => this.handleFieldChange(e, 'userSex', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="性别"
                maxLength={6}
              />
            );
          }
          return text;
        },
      },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        key: 'userPhone',
        width:'16%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'userPhone', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入手机号！"
                maxLength={11}
              />
            );
          }
          return text;
        },
      },
      {
        title: '密码',
        dataIndex: 'userPassword',
        key: 'userPassword',
        width:'10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'userPassword', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入密码"
                maxLength={10}
              />
            );
          }
          return text;
        },
      },
      {
        title: '地址',
        dataIndex: 'userAddress',
        key: 'userAddress',
        width:'10%',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'userAddress', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入地址"
                maxLength={20}
              />
            );
          }
          return text;
        },
      },
      {
        title: '银行卡号',
        dataIndex: 'userBankCard',
        key: 'userBankCard',
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'userBankCard', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="银行卡号"
                maxLength={20}
              />
            );
          }
          return text;
        },
      },
      {
        title: '注册时间',
        dataIndex: 'createDateLabel',
        key: 'createDateLabel',
      },
      {
        title: '上次登录时间',
        dataIndex: 'loginTime',
        key: 'loginTime',
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
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                  <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key,record.id)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
             {/* <Divider type="vertical" />
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                <a>删除</a>
              </Popconfirm>*/}
            </span>
          );
        },
      },
    ];
    const { data,userData ={} } = this.state;
    const { loading } = this.props;
    const paginationProps = {
      pageSize: userData.rows,
      total: userData.totalRows,
    };
    return (
      <Fragment>
        <Table
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={paginationProps}
          onChange={this.toPagination}
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
          新增成员
        </Button>
      </Fragment>
    );
  }
}
