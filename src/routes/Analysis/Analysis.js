import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import DescriptionList from 'components/DescriptionList';
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
import styles from './Analysis.less';

const { Description } = DescriptionList;
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
export default class Analysis extends Component {
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
            <FormItem label="代理商/网点">
              {getFieldDecorator('no',{
                rules: [{
                  required: true,
                  message: '请输入代理商/网点名称!',
                }],
              })(<Input placeholder="请输入代理商/网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={10}>
            <FormItem label="查询时间">
              {getFieldDecorator('date', rangeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col xl={24} xxl={8} style={{textAlign:'right'}}>
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
      title: '日期',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '做单人员',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '当日做单数',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '当日做单价合计',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '兼职费用',
        dataIndex: 'accountPeriod1',
        key: 'accountPeriod',
      }, {
        title: '代理费用',
        dataIndex: 'accountPeriod2',
        key: 'accountPeriod',
      },
    ];
    return(
      <Table dataSource={dataSource} columns={columns} pagination={true}/>
    )
  };
  render() {
    return (
      <PageHeaderLayout title="客单分析">
        <div className={`${styles.box} ${styles.bgfff}`}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div>
              {this.renderOrderTable()}
            </div>
          </div>
        </div>
        <Card bordered={false} style={{marginTop:32 }}>
          <DescriptionList size="large" title="合计" style={{ marginBottom: 32 }}>
            <Description term="做单人员统计">1000000000</Description>
            <Description term="当然做单量合计">已取货</Description>
            <Description term="当日做单价合计">1234123421</Description>
            <Description term="兼职费用合计">1234123421</Description>
            <Description term="代理费用合计">3214321432</Description>
            <Description term="人均做单量">1000000000</Description>
            <Description term="平均人均做单价">已取货</Description>
            <Description term="人均兼职费用">1234123421</Description>
            <Description term="人均代理费用">1234123421</Description>
            <Description term="差额">3214321432</Description>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    )
  }
}

