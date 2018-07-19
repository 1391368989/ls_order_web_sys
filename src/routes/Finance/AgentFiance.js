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

const RangePicker = DatePicker.RangePicker;
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请输入要查询的时间段!' }]
}

const FormItem = Form.Item;
const status= ['不合格','合格'];
const statusMap = ['default', 'processing'];
@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))
export default class AgentFiance extends Component {
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
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="提现状态">
              {getFieldDecorator('no3',{
                rules: [{
                  required: true,
                  message: '请输入提现状态!',
                }],
              })(<Input placeholder="提现状态" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={10}>
            <FormItem label="查询时间">
              {getFieldDecorator('date', rangeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={8} style={{textAlign:'right'}}>
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
  renderFinanceDetailTable(){
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
      dataIndex: 'no1',
      key: 'no1',
    },{
      title: '代理商名称',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '提现金额',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '提现手续费',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '提现实际金额',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '提现时间',
        dataIndex: 'accountPeriod2',
        key: 'accountPeriod',
      }, {
        title: '提现完成时间',
        dataIndex: 'accountPeriod3',
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
    ];
    return(
      <Table dataSource={dataSource} columns={columns} pagination={true}/>
    )
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
      title: '历史总收益',
      dataIndex: 'no1',
      key: 'no1',
    },{
      title: '总余额',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '可提现余额',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '冻结金额',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '账期',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '操作',
        render() {
          return (
            <div>
              <a href="javascript:;">申请体现</a>
            </div>
          );
        },
      },
    ];
    return(
      <Table dataSource={dataSource} columns={columns} pagination={false}/>
    )
  };
  render(){
    return(
      <PageHeaderLayout title="我的财务">
        <Card>
          {this.renderFinanceTable()}
        </Card>
        <Card style={{marginTop:34}} title="提现明细">
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div>
              {this.renderFinanceDetailTable()}
            </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

