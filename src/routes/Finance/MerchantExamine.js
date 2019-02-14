import React, { Component } from 'react';
import moment from 'moment'
import {formReset} from '../../utils/utils'
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import {
  Row,
  Col,
  Select,
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
import OderDetails from '../Order/OderDetails.js';
import styles from '../Order/OrderInfo.less';

const RangePicker = DatePicker.RangePicker;
const status= [
  {code:0,label:'未打款'},
  {code:1,label:'已打款'}
];

const FormItem = Form.Item;
const Option = Select.Option;
@Form.create()
@connect(({ order,finance, loading }) => ({
  order,
  finance,
  loading: loading.effects['order/fetchAccountShopList'],
}))
export default class OrderInfo extends Component {
  state ={
    query:{
      page_page:1,
      page_rows:10,
    },
    page:1
  }
  //orderList
  componentDidMount(){
    this.initPagination();
    const { dispatch } = this.props;
    dispatch({
      type: 'order/fetch',
      payload: {
        type: "orderstatus"
      },
    });
  }

  initPagination =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/fetchAccountShopList',
      payload:this.state.query,
    });
  };
  onChange = (e)=>{
    const query = this.state.query;
    this.state.query ={
      ...query,
      page_rows:e.pageSize,
      page_page:e.current,
    };
    this.initPagination()
  };

  onBack=()=>{
    this.setState({
      page:1
    });
    this.initPagination();
  };
  addExpenseAccount =(item)=>{
    this.setState({
      page:2,
      parentData:item
    })
  };
  makeMoney =(item,statue)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/updateAccountShopStatue',
      payload:{
        order_shop_statue:statue,
        parent_order_id:item.parentOrderId,
        order_promulgator:item.orderPromulgator,
      },
    });
  };
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if(values.date){
        const date = [moment(values.date[0]._d).format('YYYY-MM-DD'),moment(values.date[1]._d).format('YYYY-MM-DD HH:mm:ss')];
      }
      const query = this.state.query;
      this.state.query ={
        ...query,
        page_page:1,
        search_parentOrderName_LIKE:values.orderName,
        search_orderPromulgator_LIKE:values.orderPromulgator,
        search_orderStatus_EQ:values.orderstatus,
        search_orderEffectiveDate_GTE:date[0],
        search_orderEffectiveDate_LT:date[1],
      };
      this.initPagination()
    });
  };
  //重置
  handleFormReset =()=>{
    formReset(this)
    // this.initPagination()
  };
  renderSimpleForm = ()=> {
    const { form ,order } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="商户名称">
              {
                getFieldDecorator('orderName')
                (<Input placeholder="请输入商户名称" />)
              }
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={5}>
            <div style={{height:'56.5px'}}>
              <FormItem label="订单状态">
                {getFieldDecorator('orderstatus')(
                  <Select placeholder="请选择订单状态">
                    {status.map((item,index) =>
                      <Option value={item.code} key={index}>{item.label}</Option>
                    )}
                  </Select>
                )}
              </FormItem>
            </div>
          </Col>
          <Col xs={24}  xl={12} xxl={9} style={{height:'100%'}}>
            <FormItem label="查询时间">
              {getFieldDecorator('date')(
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
            <Button className={`${styles.submitButtons}`} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };
  renderOrderTable(){
    const {order,loading} = this.props;
    const {orderAccountShopPage} = order;
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '商户',
        dataIndex: 'orderPromulgator',
        key: 'orderPromulgator',
      }, {
        title: '生效时间',
        dataIndex: 'childOrderUpdateDate',
        render:(text,record)=>{
          const date = moment(text).format('YYYY-MM-DD');
          return <span>{date}</span>
        }
      },
      {
        title: '金额',
        dataIndex:'orderRealPrice',
        key: 'orderRealPrice',
      },
      {
        title: '状态',
        dataIndex: 'status',
        render(text) {
          if(text === 1){
            return <div >未打款</div>;
          }
          return <div>已打款</div>;
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          console.log(record.order_shop_statue)
          if(record.order_shop_statue === 1){
            return (
              <div>
                <a onClick={()=>this.addExpenseAccount(record)}>查看详情</a>
                <Divider type="vertical" />
                <a onClick={()=>this.makeMoney(record,0)}>驳回操作</a>
              </div>
            );
          }
          return (
            <div>
              <a onClick={()=>this.addExpenseAccount(record)}>查看详情</a>
              <Divider type="vertical" />
              <a onClick={()=>this.makeMoney(record,1)}>确认打款</a>
            </div>
          );
        },
      }
    ];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: orderAccountShopPage.rows,
      total: orderAccountShopPage.totalRows,
      current:orderAccountShopPage.page
    };
    return(
      <Table
        dataSource={orderAccountShopPage.dataList}
        columns={columns}
        pagination={paginationProps}
        loading={loading}
        onChange={this.onChange}
        rowKey={record => record.id}
      />
    )
  };
  render() {
    return (
      <div>
        {
          this.state.page === 1&&
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
        }
        {
          this.state.page === 2&&
          <OderDetails onBack={this.onBack}  parentData = {this.state.parentData}/>
        }
      </div>
    )
  }
}

