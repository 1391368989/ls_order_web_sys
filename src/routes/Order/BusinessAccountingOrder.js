import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Link } from 'dva/router';
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
import styles from './OrderInfo.less';

const RangePicker = DatePicker.RangePicker;
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请输入要查询的时间段!' }]
}
const status= ['进行中','待核实','已核实'];
const statusMap = ['default', 'await','verify'];
const FormItem = Form.Item;
@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))
export default class OrderInfo extends Component {
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
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="商户名称">
              {getFieldDecorator('no',{
                rules: [{
                  required: true,
                  message: '请输入网点名称!',
                }],
              })(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="订单状态">
              {getFieldDecorator('no2',{
                rules: [{
                  required: true,
                  message: '请输入网点名称!',
                }],
              })(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={9}>
            <FormItem label="查询时间">
              {getFieldDecorator('date', rangeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col xs={24} xl={12} xxl={5} style={{textAlign:'right'}}>
            <span className={`${styles.submitButtons} ${styles.mr20}`}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };
  renderOrderTable(){
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
      title: '商户',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '创建时间',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '金额',
        dataIndex: 'accountPeriod1',
        key: 'accountPeriod1',
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
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <Link to='/order/oder-details'>详情</Link>
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
      <PageHeaderLayout title="商户已核算订单">
        <div className={`${styles.box} ${styles.bgfff}`}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div>
              {this.renderOrderTable()}
            </div>
          </div>
        </div>
      </PageHeaderLayout>
    )
  }
}

