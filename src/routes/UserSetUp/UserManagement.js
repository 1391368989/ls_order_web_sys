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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/pagingUserList',
      payload:{
        page_rows:10,
        page_page:1,
      }
    });
  }

  render() {
    const { form, rule } = this.props;
    const {userData} = rule;
    const { getFieldDecorator} = form;
    const tableData = [
      {
        key: '1',
        workId: '00001',
        name: 'John Brown',
        department: 'New York No. 1 Lake Park',
      },
      {
        key: '2',
        workId: '00002',
        name: 'Jim Green',
        department: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        workId: '00003',
        name: 'Joe Black',
        department: 'Sidney No. 1 Lake Park',
      },
    ];
    return (
      <PageHeaderLayout title="成员管理">
        <Card bordered={false}>
          {getFieldDecorator('members', {
            initialValue: userData.dataList,
          })(<TableForm />)}
        </Card>
      </PageHeaderLayout>
    )
  }
}


