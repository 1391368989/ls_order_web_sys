import React, { Component } from 'react';
import { connect } from 'dva';

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
  Popconfirm
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import Authorized from '../../utils/Authorized';

import styles from './AgentPutForward.less';
const FormItem = Form.Item;
const statusMap = ['default', 'processing'];
const status = ['待审核', '已提现'];

@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))

export default class AgentPutForward extends Component {

  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const date = [moment(values.date[0]._d).format('YYYY-MM-DD HH:mm'),moment(values.date[1]._d).format('YYYY-MM-DD HH:mm')];
      values ={
        ...values,
        date:date
      }
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'workplace/fetch',
        payload: values,
      });
    });
  };
  confirm  = key =>{
  };
  cancel  = key =>{
  }
  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="代理商">
              {getFieldDecorator('no',{
                rules: [{
                  required: true,
                  message: '请输入代理商编号!',
                }],
              })(<Input placeholder="请输入代理商编号" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
          </Col>
          <Col md={4} sm={24} style={{textAlign:'right'}}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };
  renderSuperAdminTable(){
    const dataSource = [{
      key: '1',
      no: '0225105',
      totalIncome: '100000',
      totalBalance: '40000',
      presentBalance: '40000',
      accountPeriod: '40000',
      accountState:'审核中',
    }];
    const columns = [{
      title: 'ID',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '代理商名称',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '提现金额',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '提现手续费',
        dataIndex: 'presentBalances',
        key: 'presentBalances',
      },
      {
        title: '提现实际金额',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      }, {
        title: '提现时间',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },{
        title: '提现完成时间',
        dataIndex: 'accountPeriodddd',
        key: 'accountPeriod',
      },
      {
        title: '提现状态',
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
        render: (text, record) => {
          return (
            <div>
              <Popconfirm title="是否已经打款？" onConfirm={() => this.confirm(record.key)}>
                <a>打款</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title="是否驳回打款操作？" onConfirm={() => this.cancel(record.key)}>
                <a>驳回</a>
              </Popconfirm>
            </div>
          );
        },
      }
    ];
    return(
      <Table dataSource={dataSource} columns={columns} pagination={true}/>
    )
  };
  renderFinanceTable(){
    const dataSource = [{
      key: '1',
      no: '0225105',
      totalIncome: '100000',
      totalBalance: '40000',
      presentBalance: '40000',
      accountPeriod: '40000',
      accountState:'审核中',
    }];
    const columns = [{
      title: 'ID',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '代理商名称',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '提现金额',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '提现时间',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '提现状态',
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
        render: (text, record) => {
          return (
            <div>
              <Button type="primary">
                确认打款
              </Button>
            </div>
          );
        },
      }
    ];
    return(
      <Table dataSource={dataSource} columns={columns} pagination={true}/>
    )
  };
  render() {
    return (
      <PageHeaderLayout title="代理商提现明细">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Authorized authority="superAdmin">
              {this.renderSuperAdminTable()}
            </Authorized>
            <Authorized authority="finance">
              {this.renderFinanceTable()}
            </Authorized>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

