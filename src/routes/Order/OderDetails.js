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
@connect(({ order,childOrder, loading }) => ({
  childOrder,
  order,
  loading: loading.effects['childOrder/childOrderList'],
  orderLoading: loading.effects['childOrder/childOrderList'],
}))
export default class OrderInfo extends Component {

  state ={
    query:{
      page_page:1,
      page_rows:10,
    },
    queryChildOrder:{
      page_page:1,
      page_rows:10,
    },
    page:1
  };
  componentDidMount(){
    const { parentData } = this.props;
    const {query ,queryChildOrder} = this.state;
    this.state.query = {
      ...query,
      search_orderPromulgator_EQ:parentData.orderPromulgator,
      search_childOrderCreateDateLabel_GTE:parentData.orderCreateDateLabel,
      search_childOrderCreateDateLabel_LT:parentData.orderCreateDateLabel
    };
    this.state.queryChildOrder = {
      ...queryChildOrder,
      search_orderPromulgator_EQ:parentData.orderPromulgator,
      search_orderCreateDateLabel_GTE:parentData.orderCreateDateLabel,
      search_orderCreateDateLabel_LT:parentData.orderCreateDateLabel
    };
    this.initPagination();
    this.initChildOrderPagination()
    //增加主订单查询

  }
  initChildOrderPagination =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/orderList',
      payload:this.state.queryChildOrder,
    });
  };
  initPagination =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'childOrder/childOrderList',
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

  back =()=>{
    const { onBack } = this.props;
    onBack();
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
            <FormItem label="主订单名称">
              {getFieldDecorator('no')(<Input placeholder="请输入订单名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="网点/代理商名称">
              {getFieldDecorator('no1')(<Input placeholder="请输入网点/代理商名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="订单状态">
              {getFieldDecorator('no2')(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6} style={{textAlign:'right'}}>
            <span className={`${styles.submitButtons} ${styles.mr20}`}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
            <span className={`${styles.submitButtons}`}>
              <Button>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };
  renderOrderTable(){
    const {childOrder,loading} = this.props;
    const {childOrderPage} = childOrder;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: childOrderPage.rows,
      total: childOrderPage.totalRows,
      current:childOrderPage.page
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
       {
      title: '用户姓名',
      dataIndex: 'userName',
      key: 'userName',
    },
      {
        title: '手机号',
        dataIndex: 'userPhone',
        key: 'userPhone',
      },
      {
        title: '身份证号',
        dataIndex: 'userIdcode',
        key: 'userIdcode',
      },
      {
        title: '订单备注',
        dataIndex: 'childOrderRemake',
        key: 'childOrderRemake',
      },
      {
        title: '商家单笔金额',
        dataIndex: 'accountPeriod1',
        key: 'accountPeriod1',
      },
      {
        title: '商户名称',
        dataIndex: 'orderPromulgator',
        key: 'orderPromulgator',
      },
      {
        title: '订单名称',
        dataIndex: 'orderName',
        key: 'orderName',
      },
      {
        title: '网点/代理商',
        dataIndex: 'companyName',
        key: 'companyName',
      },
      {
        title: '创建时间',
        dataIndex: 'childOrderCreateDateLabel',
        key: 'childOrderCreateDateLabel',
      },
      {
        title: '创建用户',
        dataIndex: 'name4',
        key: 'name4',
      },
      {
        title: '状态',
        dataIndex: 'childOrderStatusLbel',
        key: 'childOrderStatusLbel',
      },
    ];
    return(
      <Table
        dataSource={childOrderPage.dataList}
        columns={columns}
        pagination={paginationProps}
        loading={loading}
        onChange={this.onChange}
        rowKey={record => record.id}
      />
    )
  };
  renderTable(){
    const {orderLoading ,order} = this.props;
    const {orderPage} = order;
    const paginationProps = {
     /* showSizeChanger: true,
      showQuickJumper: true,*/
      pageSize: orderPage.rows,
      total: orderPage.totalRows,
      current:orderPage.page
    };
    const columns = [
      /*{
        title: '商户名称',
        dataIndex: 'orderPromulgator',
        key: 'orderPromulgator',
      },*/
      {
        title: '订单名称',
        dataIndex: 'orderName',
        key: 'orderName',
      },
      {
        title: '合格人数',
        dataIndex: 'orderRealNum',
        key: 'orderRealNum',
      }, {
        title: '不合格数',
        dataIndex: 'orderNum',
        key: 'orderNum',
      },
      {
        title: '商户单笔价格',
        dataIndex: 'orderRealPrice',
        key: 'orderRealPrice',
      },
      {
        title: '订单金额',
        render:(text,item)=>{
          return(
            <div>
              {item.orderRealPrice*item.orderRealNum}
            </div>
          )
        }
      }
    ];
    return(
      <div>
        <Table
          dataSource={orderPage.dataList}
          columns={columns}
          pagination={paginationProps}
          loading={orderLoading}
          rowKey={record => record.id}
        />
      </div>

    )
  };
  render() {
    const { parentData } = this.props;
    return (
      <PageHeaderLayout title="核算订单详情">
        <div className={`${styles.box} ${styles.bgfff}`}>
          <Button onClick={this.back} type="primary" className={`${styles.mb20}`}>返回</Button>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div>
              {this.renderOrderTable()}
            </div>
          </div>
        </div>
        <div style={{marginTop:'100px'}}>
          <Row>
            <Col xs={12} className={`${styles.box} ${styles.bgfff}`}>
              <div>小计</div>
              <div>商户名称: <span>{parentData.orderPromulgator}</span> </div>
              {this.renderTable()}
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    )
  }
}

