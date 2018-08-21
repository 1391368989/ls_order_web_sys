import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import TableForm from './TableForm';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Table
} from 'antd';

import styles from './UserManagement.less';

@Form.create()
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
export default class UserManagement extends Component {
  start={
    query:{
      page_rows:10,
      page_page:1,
    }
  };
  componentDidMount() {
    this.onInit();
  }
  onInit(){
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/pagingUserList',
      payload:this.start.query
    });
  };
  toPagination =(current)=>{
    this.start.query.page_page = current;
    this.onInit();
  };
  render() {
    const { form, rule } = this.props;
    const {userData} = rule;
    const { getFieldDecorator} = form;
    return (
      <PageHeaderLayout title="成员管理">
        <Card bordered={false}>
          {getFieldDecorator('members', {
            initialValue: userData.dataList,
          })(<TableForm onInit={()=>this.onInit()} onToPagination={(e)=>this.toPagination(e)}/>)}
        </Card>
      </PageHeaderLayout>
    )
  }
}


