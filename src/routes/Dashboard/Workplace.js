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
  loading: loading.effects['workplace/fetch'],
}))
@Form.create()
export default class Workplace extends PureComponent {
  state = {
    formValues: {},
  };
  componentDidMount() {
    const { dispatch } = this.props;
    //请求
   /* dispatch({
      type: 'workplace/fetch',
      payload:{id:'1041'}
    });*/
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
    const { form ,loading} = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
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
            <FormItem label="时间节点">
              {getFieldDecorator('date', rangeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" loading={loading}>
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
  render() {
    const dataSource = [{
      key: '1',
      no: '0225105',
      totalIncome: '100000',
      totalBalance: '40000',
      presentBalance: '40000',
      accountPeriod: '40000',
    }];
    const columns = [
      {
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
    const { workplace } =this.props;
    const { chartData } = workplace;
    const  series = [
      {
        title:'actual',
        name:'实际单量',
        type:'bar',
        color:'#1890ff'
      },
      {
        title:'expect',
        name:'预期单量',
        type:'bar',
        color:'#2fc25b'
      },
      {
        title:'ratio',
        name:'合格率',
        type:'line',
        yAxisIndex: 1,
        color:'#facc14',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      }
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            {chartData !=null &&
            <Table dataSource={dataSource} columns={columns} pagination={false}/>
            }
          </div>
        </Card>
        {chartData !=null &&
        <Card title="每日单量" style={{marginTop:34}}>
          <MyCharts data={chartData} config={{x:'time',series:series}} />
        </Card>
        }
      </PageHeaderLayout>
    );
  }
}
