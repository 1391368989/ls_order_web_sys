import React, { Component } from 'react';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getAuthority} from '../../utils/utils';
import { connect } from 'dva';
import {
  Row,
  Col,
  Popconfirm,
  Form,
  Input,
  Icon,
  Button,
  Select,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Table
} from 'antd';
import styles from './OrderInfo.less';

import AddOrder from './AddOrder'
import SetCompanyBind from './SetCompanyBind'

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;
@Form.create()
@connect(({ order, loading }) => ({
  order,
  loading: loading.effects['order/orderList'],
}))

export default class OrderInfo extends Component {
  state = {
    visible:false,
    visibleCompanyBind:false,
    data:null,
    orderId:null,
    query:{
      page_rows:10,
      page_page:1,
    }
  };
  componentDidMount() {
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
      type: 'order/orderList',
      payload: this.state.query
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
   /*   values ={
        ...values,
      };*/
      const query = this.state.query;
      this.state.query ={
        ...query,
        search_orderName_LIKE:values.orderName,
        search_orderPromulgator_LIKE:values.orderPromulgator,
        search_orderStatus_EQ:values.orderstatus,
        search_orderEffectiveDate_GTE:date[0],
        search_orderEffectiveDate_LT:date[1],
      };
      this.initPagination()
    });
  };
  handleFormReset =()=>{
    this.props.form.resetFields();
    this.state.query ={
      page_rows:10,
      page_page:1,
    };
    this.initPagination()
  };
  renderSimpleForm = ()=> {
    const { form, order } = this.props;
    const {statusList} = order;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="订单名称">
              {getFieldDecorator('orderName')(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="商户名称">
              {getFieldDecorator('orderPromulgator')(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderstatus')(
                <Select placeholder="请选择订单状态">
                  {statusList.map((item,index) =>
                    <Option value={item.code} key={index}>{item.label}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={9}>
            <FormItem label="查询时间">
              {getFieldDecorator('date')(
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
            <Button className={`${styles.submitButtons} ${styles.mr20}`} onClick={this.handleFormReset}>
              重置
            </Button>
            {getAuthority('/order/order/insertOrder')&&
            <span className={`${styles.submitButtons} ${styles.mr20}`}>
              <Button type="primary" onClick={this.showModal}>
                添加
              </Button>
            </span>
            }
            <span className={styles.submitButtons}>
              <Button type="primary" >
                批量上传
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };
  toSetOrder=(item)=>{
    this.setState({
      data:item,
    });
    this.showModal();
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
  interruptOrder =(orderId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/interruptOrder',
      payload: {
        orderId,
      },
      callback:this.initPagination
    });
  };
  renderOrderTable(){
    const {loading ,order} = this.props;
    const {orderPage, statusList} = order;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: orderPage.rows,
      total: orderPage.totalRows,
      current:orderPage.page
    };
    let filters =[];
    for (let i in statusList){
      filters.push({
        text:statusList[i].label,
        value:i
      })
    }
    const columns = [
      {
      title: '编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    }, {
      title: '商户',
      dataIndex: 'orderPromulgator',
      key: 'orderPromulgator',
    }, {
      title: '订单名称',
      dataIndex: 'orderName',
      key: 'orderName',
    },
      {
        title: '商家单价',
        dataIndex: 'orderPrice',
        key: 'orderPrice',
      }, {
        title: '计划单量',
        dataIndex: 'orderAllNum',
        key: 'orderAllNum',
      },{
        title: '代理商单价',
        dataIndex: 'orderAgencyAllPrice',
        key: 'orderAgencyAllPrice',
      },{
        title: '实际单数',
        dataIndex: 'orderNum',
        key: 'orderNum',
      },{
        title: '预计金额',
        dataIndex: 'orderPredictPrice',
        key: 'orderPredictPrice',
      },{
        title: '实际金额',
        dataIndex: 'accountPeriod6',
        key: 'accountPeriod6',
      },{
        title: '创建用户',
        dataIndex: 'orderCreateUserLabel',
        key: 'orderCreateUserLabel',
      },{
        title: '生效时间',
        dataIndex: 'orderEffectiveDateLabel',
        key: 'orderEffectiveDateLabel',
      },
      {
        title: '修改用户',
        dataIndex: 'orderUpdateUserLabel',
        key: 'orderUpdateUserLabel',
      },{
        title: '修改时间',
        dataIndex: 'orderUpdateDateLabel',
        key: 'orderUpdateDateLabel',
      },
      {
        title: '状态',
        dataIndex: 'orderStatusLabel',
        key: 'orderStatusLabel',
    /*    filters: filters,
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusList[val].code} text={statusList[val].label} />;
        },*/
      },
      {
        title: '操作',
        render: (text, record) => {
          if(record.orderStatus === 4 ){
            return (
              <div>
                <span>已下架</span>
              </div>
            );
          }
          return (
            <div>
              <Popconfirm title="是否要下架当前订单,下架后不可返回？"  onConfirm={() => this.interruptOrder(record.id)}>
                <a style={{color:'red'}}>下架</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a href='javascript:;'onClick={()=>this.toSetOrder(record)}>编辑</a>
              <Divider type="vertical" />
              <a href='javascript:;' onClick={()=>this.showCompanyModal(record.id)}>管理商家</a>
            </div>
          );
        },
      }
    ];
    return(
      <Table dataSource={orderPage.dataList} columns={columns} pagination={paginationProps} loading={loading} rowKey={record => record.id} onChange={this.onChange}/>
    )
  };
  handleOk=()=>{
    this.setState({
      visible:false,
    })
  };
  handleCancel=()=>{
    this.setState({
      visible:false,
    })
  };
  showModal=()=>{
    this.setState({
      visible:true,
    })
  };
  handleCompanyOk=()=>{
    this.setState({
      visibleCompanyBind:false,
    })
  };
  handleCompanyCancel=()=>{
    this.setState({
      visibleCompanyBind:false,
    })
  };
  showCompanyModal=(id)=>{
    this.setState({
      orderId:id,
      visibleCompanyBind:true,
    })
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
        <Modal
          title="添加/修改订单"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose ={true}
          width={'50%'}
        >
          {this.state.visible&&<AddOrder data={this.state.data}/>}
        </Modal>
        <Modal
          title="绑定代理商/网点"
          visible={this.state.visibleCompanyBind}
          onOk={this.handleCompanyOk}
          onCancel={this.handleCompanyCancel}
          destroyOnClose ={true}
          width={'800px'}
        >
          {this.state.visibleCompanyBind&&<SetCompanyBind orderId={this.state.orderId}/>}
        </Modal>
      </PageHeaderLayout>
    )
  }
}

