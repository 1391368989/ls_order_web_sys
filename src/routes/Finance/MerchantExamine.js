import React, { Component } from 'react';
import { Link } from 'dva/router';
import { connect } from 'dva';
import moment from 'moment';
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
import styles from './MerchantExamine.less';

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请输入要查询的时间段!' }],
};
const status= ['未支付','已结算'];
const statusMap = ['default', 'processing'];
@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))
export default class MerchantExamine extends Component {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    title:'商户到账审核',
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
  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="商户">
              {getFieldDecorator('no',{
                rules: [{
                  required: true,
                  message: '请输入商户名称!',
                }],
              })(<Input placeholder="请输入商户名称" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="时间">
              {getFieldDecorator('date', rangeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
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
  toPageDetails =() =>{
    this.setState({
      title: '订单详情',
    });
  };
  confirm  = key =>{
  };
  cancel  = key =>{
  }
  renderFinanceTable(){
    const dataSource =[{
      key: '1',
      no: '0225105',
      totalIncome: '100000',
      totalBalance: '40000',
      presentBalance: '40000',
      accountPeriod: '40000',
      accountState:'审核中',
    }
    ];
    const columns = [{
      title: 'ID',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '商户名称',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '创建时间',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '金额',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '状态',
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
        title: '详情',
        render: (text, record) => {
          return (
            <div>
              <Link to='/finance/merchant-examine/merchant-examine-details'>查看</Link>
            </div>
          );
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <Popconfirm title="是否已经收到商户打款？" onConfirm={() => this.confirm(record.key)}>
                <a>确认收款</a>
              </Popconfirm>
              <Divider type="vertical" />
              <Popconfirm title="是否驳回确认收款操作？" onConfirm={() => this.cancel(record.key)}>
                <a>驳回操作</a>
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
  render() {
    return (
      <PageHeaderLayout title={this.state.title}>
        <div className={`${styles.box} ${styles.bgfff}`}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div>
              {this.renderFinanceTable()}
            </div>
          </div>
        </div>
      </PageHeaderLayout>
    )
  }
}
