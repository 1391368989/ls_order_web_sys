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
import styles from './OrderInfo.less';

const RangePicker = DatePicker.RangePicker;
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请输入要查询的时间段!' }]
}
const status= ['进行中','待核实','已核实'];
const statusMap = ['default', 'await','verify'];
const FormItem = Form.Item;
@Form.create()
@connect(({ order, loading }) => ({
  order,
  loading: loading.models.workplace,
}))
export default class OrderInfo extends Component {
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'order/orderList',
      payload: {
        search_orderPromulgator_LIKE:'提供者'
      },
    });
  }

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
            <FormItem label="网点名称">
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
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="商户名称">
              {getFieldDecorator('no3',{
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
          <Col xs={24} style={{textAlign:'left'}}>
            <span className={`${styles.submitButtons} ${styles.mr20}`}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
            <span className={`${styles.submitButtons} ${styles.mr20}`}>
              <Button type="primary" htmlType="submit">
                添加
              </Button>
            </span>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                批量上传
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
      title: '订单名称',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '所属代理商',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '商家单价',
        dataIndex: 'accountPeriod1',
        key: 'accountPeriod',
      }, {
        title: '计划单量',
        dataIndex: 'accountPeriod2',
        key: 'accountPeriod',
      },{
        title: '代理商单价',
        dataIndex: 'accountPeriod3',
        key: 'accountPeriod',
      },{
        title: '实际单数',
        dataIndex: 'accountPeriod4',
        key: 'accountPeriod',
      },{
        title: '预计金额',
        dataIndex: 'accountPeriod5',
        key: 'accountPeriod',
      },{
        title: '实际金额',
        dataIndex: 'accountPeriod6',
        key: 'accountPeriod',
      },{
        title: '创建用户',
        dataIndex: 'accountPeriod7',
        key: 'accountPeriod',
      },{
        title: '创建时间',
        dataIndex: 'accountPeriod8',
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
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <a href='javascript:;'>下架</a>
              <Divider type="vertical" />
              <a href='javascript:;'>编辑</a>
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
      <PageHeaderLayout title="订单列表">
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

