import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
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
  Table
} from 'antd';

import styles from './MerchantExamine.less';
const FormItem = Form.Item;
const status= ['不合格','合格'];
const statusMap = ['default', 'processing'];
@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))
export default class Details extends Component {
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
  renderSimpleForm = ()=> {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xs={24}  md={12} xl={6}>
            <FormItem label="订单名称">
              {getFieldDecorator('no',{
                rules: [{
                  required: true,
                  message: '请输入订单名称!',
                }],
              })(<Input placeholder="请输入订单名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  md={12} xl={6}>
            <FormItem label="网点名称">
              {getFieldDecorator('no2',{
                rules: [{
                  required: true,
                  message: '请输入网点名称!',
                }],
              })(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  md={12} xl={6}>
            <FormItem label="订单状态">
              {getFieldDecorator('no3',{
                rules: [{
                  required: true,
                  message: '请输入订单状态!',
                }],
              })(<Input placeholder="状态" />)}
            </FormItem>
          </Col>
          <Col xs={24}  md={12} lg={6} style={{textAlign:'right'}}>
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
      title: '序号',
      dataIndex: 'no1',
      key: 'no1',
    },{
      title: 'ID',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '用户姓名',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '手机号码',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '身份证号',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '订单备注',
        dataIndex: 'accountPeriod2',
        key: 'accountPeriod',
      }, {
        title: '商家单价',
        dataIndex: 'accountPeriod3',
        key: 'accountPeriod',
      }, {
        title: '商户名称',
        dataIndex: 'accountPeriod4',
        key: 'accountPeriod',
      }, {
        title: '订单备注',
        dataIndex: 'accountPeriod5',
        key: 'accountPeriod',
      }, {
        title: '订单名称',
        dataIndex: 'accountPeriod6',
        key: 'accountPeriod',
      }, {
        title: '网点名称',
        dataIndex: 'accountPeriod7',
        key: 'accountPeriod',
      }, {
        title: '创建时间',
        dataIndex: 'accountPeriod8',
        key: 'accountPeriod',
      },{
        title: ' 创建用户',
        dataIndex: 'accountPeriod9',
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
    ];
    return(
      <Table dataSource={dataSource} columns={columns} pagination={true}/>
    )
  };
  render(){
    return(
      <PageHeaderLayout title="订单详情">
        <div className={`${styles.box} ${styles.bgfff}`}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div>
              {this.renderFinanceTable()}
            </div>
          </div>
        </div>
        <div style={{marginTop:'100px'}}>
          <Row>
            <Col xs={12} className={`${styles.box} ${styles.bgfff}`}>
              <div>小计</div>
              <div>商户名称: <span>商户A</span> </div>
              {this.renderFinanceTable()}
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    )
  }
}
