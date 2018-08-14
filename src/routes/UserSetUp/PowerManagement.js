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

@Form.create()
@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))

export default class PowerManagement extends Component {
  state={
    query:{
      page_row:15,
      page_page:1,
      search_parentId_EQ:0
    }
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const query = this.state.query;
    dispatch({
      type: 'rule/fetch',
      payload:query
    });
  }

  render() {
    const { form ,rule} = this.props;
    const { getFieldDecorator} = form;
    const { data } = rule;
    const tableData = data.dataList;
    return (
      <PageHeaderLayout title="权限组设置" >
        <Card>
          <div>
            {getFieldDecorator('members', {
              initialValue: tableData,
            })(<PowerTableForm/>)}
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }

}

