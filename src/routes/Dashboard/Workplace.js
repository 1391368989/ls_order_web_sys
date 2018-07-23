import React, { PureComponent } from 'react';
import {TimelineChart} from 'components/Charts';
import MyCharts from 'components/MyCharts';
import { Chart, Tooltip, Geom, Legend, Axis } from 'bizcharts';
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
  Table
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Workplace.less';

const FormItem = Form.Item;
/*const { Option } = Select;*/
const RangePicker = DatePicker.RangePicker;
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请输入要查询的时间段!' }],
};
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))
@Form.create()
export default class Workplace extends PureComponent {
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
  backTOListInfo=()=>{
    this.props.dispatch(routerRedux.replace('/agent/agent-info'));
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
            <FormItem label="时间">
              {getFieldDecorator('date', rangeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
             {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>*/}
            </span>
          </Col>
        </Row>
      </Form>
    );
  };
  myChart(){


    return(
      <div id="main" style={{ width: 500, height: 500}}></div>
    )
  }
  render() {
    const data = {
      "offlineChartData": [
        {"x": 1531279014126, "y1": 32, "y2": 50,'y3':'78.0%'},
        {"x": 1531280814126, "y1": 104, "y2": 99},
        {"x": 1531282614126, "y1": 89, "y2": 81},
        {"x": 1531284414126, "y1": 36, "y2": 32},
        {"x": 1531286214126, "y1": 52, "y2": 96},
        {"x": 1531288014126, "y1": 71, "y2": 39},
        {"x": 1531289814126, "y1": 31, "y2": 63},
        {"x": 1531291614126, "y1": 67, "y2": 75},
        {"x": 1531293414126, "y1": 37, "y2": 78},
        {"x": 1531295214126, "y1": 35, "y2": 106},
        {"x": 1531297014126, "y1": 108, "y2": 64},
        {"x": 1531298814126, "y1": 98, "y2": 57},
        {"x": 1531300614126, "y1": 84, "y2": 105},
        {"x": 1531302414126, "y1": 49, "y2": 106},
        {"x": 1531304214126, "y1": 65, "y2": 39},
        {"x": 1531306014126, "y1": 106, "y2": 100},
        {"x": 1531307814126, "y1": 81, "y2": 18},
        {"x": 1531309614126, "y1": 106, "y2": 47},
        {"x": 1531311414126, "y1": 69, "y2": 109},
        {"x": 1531313214126, "y1": 88, "y2": 41}],
    }
    // 数据源

// 定义度量
    const cols = {
      sold: { alias: '销售量' },
      genre: { alias: '游戏种类' }
    };
    const dataSource = [{
      key: '1',
      no: '0225105',
      totalIncome: '100000',
      totalBalance: '40000',
      presentBalance: '40000',
      accountPeriod: '40000',
    }];
    const columns = [{
      title: '代理商编号',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '历史总收益*元',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '总余额*元',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '可提现余额*元',
        dataIndex: 'presentBalance',
        key: 'presentBalance',
      },
      {
        title: '账期',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <Button type="primary" title="" onClick={this.backTOListInfo}>
                申请提现
              </Button>
            </div>
          );
        },
      }
    ];
    const myDate =[
      {time:'05-01',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-02',expect:'100',actual:'70',ratio:'70%'},
      {time:'05-03',expect:'100',actual:'80',ratio:'80%'},
      {time:'05-04',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-05',expect:'100',actual:'20',ratio:'20%'},
      {time:'05-06',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-07',expect:'100',actual:'30',ratio:'30%'},
      {time:'05-08',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-09',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-10',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-11',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-12',expect:'100',actual:'40',ratio:'40%'},
      {time:'05-13',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-14',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-15',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-16',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-17',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-18',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-19',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-20',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-21',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-22',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-23',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-24',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-25',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-26',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-27',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-28',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-30',expect:'100',actual:'90',ratio:'90%'},
      {time:'05-31',expect:'100',actual:'90',ratio:'90%'},
      ];
    const dataList = [
      { name:'预计单量', 'Jan.': 18.9, 'Feb.': 28.8, 'Mar.' :39.3, 'Apr.': 81.4, 'May': 47, 'Jun.': 20.3, 'Jul.': 24, 'Aug.': 35.6, },
      { name:'实际单量', 'Jan.': 12.4, 'Feb.': 23.2, 'Mar.' :34.5, 'Apr.': 99.7, 'May': 52.6, 'Jun.': 35.5, 'Jul.': 37.4, 'Aug.': 42.4},
      { name:'合格率', 'Jan.': 10, 'Feb.': 20, 'Mar.' :10, 'Apr.': 20, 'May': 20, 'Jun.':20, 'Jul.':30, 'Aug.':20}
    ];
    const ds = new DataSet();
    const dv = ds.createView().source(dataList);

    dv.transform({
      type: 'fold',
      fields: [ 'Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.' ], // 展开字段集
      key: '月份', // key字段
      value: '月均降雨量', // value字段
    });
    dv.transform({
      type: 'ratio',
      fields: [ 'Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.' ], // 展开字段集
      key: '月份', // key字段
      value: '温度', // value字段
    });
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table dataSource={dataSource} columns={columns} pagination={false}/>
          </div>
        </Card>
        <Card title="每日单量" style={{marginTop:34}}>
          <TimelineChart
            height={400}
            data={data.offlineChartData}
            titleMap={{ y1: '预计单量', y2: '实际单量',y3:'合格率' }}
          />
          <Chart height={400} data={dv} forceFit padding={[ 20, 30, 20, 30]}>
            <Axis name="月份" />
            <Axis name="月均降雨量" />
            <Legend />
            <Tooltip crosshairs={{type : "y"}}/>
            <Geom type='interval' position="月份*月均降雨量" color={'name'} adjust={[{type: 'dodge',marginRatio: 1/32}]} />
            <Geom type="line" position="月份*温度" />
          </Chart>
          <MyCharts/>
        </Card>
      </PageHeaderLayout>
    );
  }
}
