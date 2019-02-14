import React, { PureComponent } from 'react';
import {TimelineChart} from 'components/Charts';
import {routerRedux} from 'dva/router'
import MyCharts from 'components/MyCharts';
import ModalPaging from 'components/ModalPaging';
import InsertDrawings from './InsertDrawings';
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
  loading: loading.effects['workplace/fetchSearch'],
}))
@Form.create()
export default class Workplace extends PureComponent {
  state = {
    formValues: {},
    visible:false,
    visibleMoney:false,
    data:{
      id:null,
      name:''
    },
    showBtn:false,
    query:{
      search_childOrderStatus_IN:[2],
    }
  };
  componentDidMount() {
    const { dispatch } = this.props;
    const query = this.state.query;
    //获取默认值：历史收益，fetchTotalIncome
    dispatch({
      type:'workplace/fetchTotalIncome',
      payload:query
    });
    //获取默认值:已提现金额
    dispatch({
      type:'workplace/fetchAlreadyPresented',
      payload:{
        search_drawStatus_IN:[2]
      }
    });
    //获取默认价 图表
    dispatch({
      type: 'workplace/fetchSearch',
      payload: query,
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if(values.name){
        //选择有代理商
        this.setState({
          showBtn:true,
        });
        //追加代理商id
        values ={
          ...values,
          search_childOrderCompanyId_EQ:this.state.data.id,
          search_drawCompanyId_EQ:this.state.data.id
        };
      }else{
        //没有代理商
        this.setState({
          showBtn:false,
        })
      }
      if(values.date){
        const date = [moment(values.date[0]._d).format('YYYY-MM-DD HH:mm'),moment(values.date[1]._d).format('YYYY-MM-DD HH:mm')];
        values ={
          ...values,
          search_startTime_GT :date[0],
          search_endTime_LT :date[1],
        };
      }
      const query = this.state.query;
      values ={
        ...values,
        ...query,
      };
      delete values.date;
      delete values.name;
      this.setState({
        formValues: values,
      });
      //加载总金额
      dispatch({
        type: 'workplace/fetchTotalIncome',
        payload: {
          ...values,
        },
      });
      //获取默认值:已提现金额
      dispatch({
        type:'workplace/fetchAlreadyPresented',
        payload:{
          ...values,
          search_drawStatus_IN:[2]
        }
      });
      //加载图表
      dispatch({
        type: 'workplace/fetchSearch',
        payload: values,
      });
    });
  };
  backTOListInfo=()=>{
    //this.props.dispatch(routerRedux.replace('/agent/agent-info'));
    /*this.props.dispatch({
      type: 'workplace/insertDrawings',
      payload: '',
    });*/
    this.setState({
      visibleMoney:true
    });
  };
  showModal =(e)=>{
    if(!this.state.visible){
      this.setState({
        visible:true
      });
    }
    e.target.blur()
  };
  handleFormReset =()=>{
    this.props.form.resetFields();
   /* delete values.date;
    search_childOrderCompanyId_EQ*/
  };
  renderSimpleForm() {
    const { form ,loading} = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row>
          <Col md={6} sm={24}>
            <FormItem label="代理商">
              {getFieldDecorator('name')
              (<Input placeholder="请选择代理商/网点"  onFocus={this.showModal} disabled={this.state.visible}/>)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="时间节点">
              {getFieldDecorator('date')(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <div className={styles.submitButtons} style={{textAlign:'right'}}>
              <Button type="primary" htmlType="submit" loading={loading}>
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
             {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>*/}
            </div>
          </Col>
        </Row>
      </Form>
    );
  };
  handleOk=()=>{
    this.setState({
      visible:false
    });
  };
  handleCancel=()=>{
    this.setState({
      visible:false
    });
  };
  setItem =(item)=>{
    this.state.data = item;
    this.props.form.setFieldsValue({
      name:item.name,
    });
  };
  handleMoneyOk=()=>{
    this.setState({
      visibleMoney:false
    });
  };
  handleMoneyCancel=()=>{
    this.setState({
      visibleMoney:false
    });
  };
  render() {
    const { workplace } =this.props;
    const { chartData ,totalIncome,alreadyPresented} = workplace;
    const  series = [
      {
        title:'value1',
        name:'实际金额',
        type:'bar',
        color:'#1890ff'
      },
      {
        title:'value2',
        name:'预期金额',
        type:'bar',
        color:'#2fc25b'
      },
      {
        title:'probability',
        name:'转化率',
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
    let dataSource = [{
      key: '1',
      no: '0225105',
      totalIncome: totalIncome,
      totalBalance: '',
      presentBalance: totalIncome-alreadyPresented,
      accountPeriod: '',
    }];
    let columns = [
      {
        title: '历史总收益*元',
        dataIndex: 'totalIncome',
        key: 'totalIncome',
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
              {this.state.showBtn&&
              <Button type="primary" title="" onClick={this.backTOListInfo}>
                申请提现
              </Button>
              }
            </div>
          );
        },
      }
    ];
    if(this.state.showBtn){
      dataSource[0].name = this.state.data.name;
      columns.unshift({
        title: '代理商名称',
        dataIndex: 'name',
        key: 'name',
      })
    }

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            {
            <Table dataSource={dataSource} columns={columns} pagination={false}/>
            }
          </div>
        </Card>
        {chartData !=null &&
        <Card title="每日收入" style={{marginTop:34}}>
          <MyCharts data={chartData} config={{x:'datelabel',series:series}} yAxis={{y1:{name:'金额',value:'元'}}}/>
        </Card>
        }
        <Modal
          title="选择代理商/网点"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose ={true}
          width={'50%'}
        >
          <ModalPaging onChange={this.setItem}/>
        </Modal>
        <Modal
          title="填写提现信息"
          visible={this.state.visibleMoney}
          onOk={this.handleMoneyOk}
          onCancel={this.handleMoneyCancel}
          destroyOnClose ={true}
          width={'50%'}
        >
          <InsertDrawings companyId={this.state.data.id} onChange={this.handleMoneyOk}/>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
