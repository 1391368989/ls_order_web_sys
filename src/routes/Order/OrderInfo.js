import React, { Component } from 'react';
import moment from 'moment';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Link } from 'dva/router'
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
  Upload,
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
    //是否拥有管理员权限
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
        page_page:1,
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
   // this.initPagination()
  };
  renderSimpleForm = ()=> {
    const { form, order } = this.props;
    const {statusList} = order;
    const { getFieldDecorator } = form;
    const props = {
      name: 'excelFile',
      action: '/order/order/insertOrders',
      onChange(info) {
       /* if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }*/
        if (info.file.status === 'done') {
          if(info.fileList[0].response.flag === 0){
            message.success(`批量添加成功`);
          }else {
            message.error(`${info.fileList[0].response.msg}`);
          }
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败.`);
        }
      },
    };
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
            {getAuthority('/order/order/insertOrders')&&
            <span className={styles.submitButtons}>
            <Upload {...props}>
              <Button>
                <Icon type="upload" />批量上传
              </Button>
            </Upload>
            </span>
            }
          </Col>
        </Row>
      </Form>
    );
  };
  //insertOrders
  insertOrders =(file)=>{
    return;
    if(file){
      this.props.dispatch({
        type:'order/insertOrders',
        payload:file,
        callback:()=>{

        }
      })
    }
  };

  toSetOrder=(item)=>{
    this.setState({
      data:item,
    });
    this.setState({
      visible:true,
    })
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
  deleteOrder =(orderId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/operationDeleteOrder',
      payload: {
        orderId,
      },
      callback:this.initPagination
    });
  };
  finishOrder =(orderId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/operationFinishOrder',
      payload: {
        orderId,
      },
      callback:this.initPagination
    });
  };
  accomplishOrder =(orderId)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'order/operationAccomplishOrder',
      payload: {
        orderId,
      },
      callback:this.initPagination
    });
  };
  //operationDeleteOrder
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
        title: '序号',
        dataIndex: 'id',
        key: 'id',
        width: 140,
    }, {
        title: '编号',
        dataIndex: 'orderNo',
        key: 'orderNo',
        width: 200,
    },  {
      title: '订单名称',
      dataIndex: 'orderName',
      key: 'orderName',
        width: 200,
    },
      {
        title: '商户',
        dataIndex: 'orderPromulgator',
        key: 'orderPromulgator',
        width: 180,
      },
      {
        title: '商家单价',
        dataIndex: 'orderPrice',
        key: 'orderPrice',
        width: 120,
      },
      {
        title: '代理商单价',
        dataIndex: 'orderAgencyPrice',
        key: 'orderAgencyPrice',
        width: 140,
      },
      {
        title: '计划单量',
        dataIndex: 'orderAllNum',
        key: 'orderAllNum',
        width: 120,
      },{
        title: '实际单数',
        dataIndex: 'orderRealNum',
        key: 'orderRealNum',
        width: 120,
      },{
        title: '预计金额',
        dataIndex: 'orderPredictPrice',
        key: 'orderPredictPrice',
        width: 120,
      },{
        title: '实际金额',
        dataIndex: 'orderRealPrice',
        key: 'orderRealPrice',
        width: 120,
      },{
        title: '提示信息',
        dataIndex: 'orderRemake',
        key: 'orderRemake',
        width: 180,
      },{
        title: '生效时间',
        dataIndex: 'orderEffectiveDateLabel',
        key: 'orderEffectiveDateLabel',
        width: 180,
      },
    {
        title: '订单类型',
        render:(text, record) =>{
          if(record.orderType === 1){
            return <span>不限商家</span>;
          }else{
            return(
              <div>
                {(getAuthority('/order/order/insertOrder'))&&
                <span>
                  <a href='javascript:;' onClick={()=>this.showCompanyModal(record.id)}>管理商家</a>
                </span>
                }
              </div>
              )
          }
        },
        width: 120,
      },
      {
        title: '状态',
        dataIndex: 'orderStatusLabel',
        key: 'orderStatusLabel',
        width: 240,
      },
      {
        title: '操作',
        fixed: 'right',
        render: (text, record) => {
          if(record.orderStatus === 4 ){
            return (
              <div>
                <span>已下架</span>
              </div>
            );
          }
          if(record.orderStatus === 0 ){
            return (
              <div>
                <span>已删除</span>
              </div>
            );
          }
          if(record.orderStatus === 2 ){
            return (
              <div>
                {(getAuthority('/order/order/deleteOrder')) &&
                <Popconfirm title="是否要核算当前订单,核算后不可返回？" onConfirm={() => this.finishOrder(record.id)}>
                  <a>核算</a>
                </Popconfirm>
                }
                <Divider type="vertical" />
                <Link to={'/order/to-be-verified?id='+record.id}>查看</Link>
              </div>
            );
          }
          if(record.orderStatus === 1 ){
            return (
              <div>
                {getAuthority('/order/order/interruptOrder')&&
                <Popconfirm title="是否要下架当前订单,下架后不可返回？"  onConfirm={() => this.interruptOrder(record.id)}>
                  <a style={{color:'red'}}>下架</a>
                </Popconfirm>
                }
                {getAuthority('/order/order/updateOrder')&&
                  <span>
                    <Divider type="vertical" />
                    <a href='javascript:;'onClick={()=>this.toSetOrder(record)}>编辑</a>
                  </span>
                }

                {(getAuthority('/order/order/deleteOrder')) &&
                <Popconfirm title="是否要停止订单填写，订单进入审核阶段？" onConfirm={() => this.accomplishOrder(record.id)}>
                  <Divider type="vertical" />
                  <a>结算</a>
                </Popconfirm>
                }
                {(getAuthority('/order/order/deleteOrder')) &&
                <Popconfirm title="是否要删除当前订单,删除后不可返回？" onConfirm={() => this.deleteOrder(record.id)}>
                  <Divider type="vertical" />
                  <a>删除</a>
                  </Popconfirm>
                }
                <Divider type="vertical" />
                <Link to={'/order/to-be-verified?id='+record.id}>查看</Link>
              </div>
            );
          }
          return (
           <div>
             <Link to={'/order/to-be-verified?id='+record.id}>查看</Link>
           </div>
          );
        },
        width: 240,
      }
    ];
    return(
      <Table
        dataSource={orderPage.dataList}
        columns={columns}
        pagination={paginationProps}
        loading={loading}
        rowKey={record => record.id}
        onChange={this.onChange}
        scroll={{ x: 1700}}
      />
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
      data:null,
    });
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

