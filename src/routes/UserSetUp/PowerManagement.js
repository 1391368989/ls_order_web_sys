import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import PowerTableForm from './PowerTableForm';
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
  Table,
  Tree
} from 'antd';

import styles from './style.less';
const TreeNode = Tree.TreeNode;
const status= ['活动中','已禁用'];
const statusMap = ['default', 'processing'];
@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))

export default class PowerManagement extends Component {
  state={
    visible:false,
    expandedKeys: ['0-0-0', '0-0-1'],
    autoExpandParent: true,
    checkedKeys: ['0-0-0'],
    selectedKeys: [],
  }



  render() {
    const { form } = this.props;
    const { getFieldDecorator} = form;
    const tableData = [
      {
        key: '1',
        workId: '00001',
        name: '超级管理员',
        start: '活动中',
      },
      {
        key: '2',
        workId: '00002',
        name: '管理员',
        start: '已禁用',
      },
      {
        key: '3',
        workId: '00003',
        name: '代理商',
        start: '活动中',
      },
    ];
    return (
      <PageHeaderLayout title="权限组设置">
        <Card>
          <div>
            {getFieldDecorator('members', {
              initialValue: tableData,
            })(<PowerTableForm />)}
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }

}

