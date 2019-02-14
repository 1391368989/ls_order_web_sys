import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getAuthority} from '../../utils/utils';
import moment from 'moment';
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
  Select,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Table,
  Radio
} from 'antd';
import styles from './OrderInfo.less';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;
@Form.create()
@connect(({ childOrder, loading }) => ({
  childOrder,
  childOrderListLoading: loading.effects['childOrder/childOrderList'],
}))
export default class OrderInfo extends Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    visible: false,
    value: 1,
    msg:null,
    query:{
      page_rows:10,
      page_page:1,
    }
  };
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'childOrder/fetch',
      payload: {
        type: "childorderstatus"
      },
    });
  }
  handleFormReset =()=>{
    this.props.form.resetFields();
    this.state.query ={
      page_rows:10,
      page_page:1,
    };
    this.initPagination()
  };
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const query = this.state.query;
      let childOrderCreateDate = {};
      if(values.date){
        const date = [moment(values.date[0]._d).format('YYYY-MM-DD HH:mm:ss'),moment(values.date[1]._d).format('YYYY-MM-DD HH:mm:ss')];
        childOrderCreateDate ={
          search_childOrderCreateDate_GTE:date[0],
          search_childOrderCreateDate_LT:date[1],
        };
        delete values.date;
      }
      this.state.query = {
        ...query,
        ...values,
        ...childOrderCreateDate,
        page_page:1,
      };
      this.initPagination()
    });
  };
  renderSimpleForm = ()=> {
    const { form, childOrder} = this.props;
    const {statusList} = childOrder;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="订单编号">
              {getFieldDecorator('search_childOrderNo_EQ')(<Input placeholder="请输入订单编号" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="网点/代理商名称">
              {getFieldDecorator('search_name_LIKE')(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="商户名称">
              {getFieldDecorator('search_orderPromulgator_LIKE')(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="手机号">
              {getFieldDecorator('search_userPhone_LIKE')(<Input placeholder="姓名/手机号" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="订单状态">
              {getFieldDecorator('search_childOrderStatus_EQ')(
                <Select placeholder="请选择订单状态">
                {statusList.map((item,index) =>
                  <Option value={item.code} key={index}>{item.label}</Option>
                )}
              </Select>)
              }
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={9}>
            <FormItem label="查询时间">
              {getFieldDecorator('date')(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col xs={24} style={{textAlign:'right'}}>
            <span className={`${styles.submitButtons}`}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
               <Button  style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  start = () => {
    this.setState({ loading: true });
    this.showModal();
  };

  onSelectChange = (selectedRowKeys,selectedRows) => {

    if(selectedRows.length>0){
      const data = selectedRows;
      const status = selectedRows[0].childOrderStatus;
      for(let i in data ){
        if(data[i].childOrderStatus !== status ){
          message.error('不能批量处理不同状态的订单');
          return;
        }
      }
    }
    this.setState({ selectedRowKeys ,selectedRows});
  };
  showModal = (item) => {
    if(item){
      this.state.childOrder = item;
      this.state.childOrderId = item.id;
      this.state.companyId = item.childOrderCompanyId;
    }else{
      this.state.companyId = this.props.childOrder.childOrderPage.dataList[0].childOrderCompanyId;
    }
    this.setState({
      visible: true,
      msg:null,
    });
  };

  /*
  * status  1=平台审核同意该订单,2=平台审核不同意该订单，3=商家审核通过，4=商家审核不通过订单
  * */
  handleOk = () => {
    let status;
    if(this.state.value ==2 ){
      if(this.state.msg === null){
        message.error('原由不能为空');
        return
      }
      if(this.state.selectedRows[0].childOrderStatus == 6){
        status = 4
      }else{
        status = 2
      }
    }else{
      if(this.state.selectedRows[0].childOrderStatus == 6){
        status = 3
      }else{
        status = 1
      }
    }
    if(this.state.loading){
      this.props.dispatch({
        type:'childOrder/batchOperation',
        payload:{
          query:{
            childOrderIds:this.state.selectedRowKeys,
            companyId:this.state.companyId,
            msg:this.state.msg,
          },
          type:status
        },
        callback:()=>{
          this.initPagination();
          this.setState({
            selectedRowKeys: [],
            loading: false,
          });
        }
      });
    }else{
      this.props.dispatch({
        type:'childOrder/operation',
        payload:{
          query:{
            childOrderId:this.state.childOrderId,
            companyId:this.state.companyId,
            msg:this.state.msg,
          },
          type:status
        },
        callback:()=>{
          this.initPagination();
        }
      });
    }
    this.setState({
      visible: false,
    });
  };
  onRevoke = (item)=>{
    let status = 1;
    if(this.state.selectedRows[0].childOrderStatus == 6){
      status = 1;
    }
    this.props.dispatch({
      type:'childOrder/revoke',
      payload:{
        query:{
          childOrderId:item.id,
          companyId:item.childOrderCompanyId,
        },
        type:status
      },
      callback:()=>{
        this.initPagination();
      }
    });
  };
  handleCancel = (e) => {
    this.setState({
      visible: false,
      loading: false
    });
  };
  onChange = (e) => {
    this.setState({
      value: e.target.value,
    });

  };
  onChangeMsg =(e)=>{
    this.state.msg = e.target.value;
  };
  onPaginationChange = (e)=>{
    const query = this.state.query;
    this.state.query ={
      ...query,
      page_rows:e.pageSize,
      page_page:e.current,
    };
    this.initPagination()
  };
  initPagination =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'childOrder/childOrderList',
      payload: this.state.query,
    });
  };
  getCheckboxProps =(record)=>{
    const status = record.childOrderStatus;
    let disabled = true;
    if(status==6){
      disabled = false;
    }
    if(status==5&&getAuthority('/order/order/platformAgreeChildOrder')){
      //如果有平台审核订单权限
      disabled = false;
    }
    if(status==2||status==0&&getAuthority('/order/order/platformAgreeChildOrder')){
      disabled = false;
    }
    return({
      disabled: disabled, // Column configuration not to be checked
      name: record.childOrderNo,
    })
  };
  renderOrderTable(){
    const { childOrder,childOrderListLoading } = this.props;
    const { childOrderPage } = childOrder;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: childOrderPage.rows,
      total: childOrderPage.totalRows,
      current:childOrderPage.page
    };
    const columns = [
      {
      title: '编号',
      dataIndex: 'childOrderNo',
      key: 'childOrderNo',
    }, {
      title: '用户姓名',
      dataIndex: 'userName',
      key: 'userName',
    }, {
      title: '手机号码',
      dataIndex: 'userPhone',
      key: 'userPhone',
    },
      {
        title: '身份证号',
        dataIndex: 'userIdcode',
        key: 'userIdcode',
      },
      {
        title: '提示信息',
        dataIndex: 'childOrderRemake',
        key: 'childOrderRemake',
      },
      {
        title: '订单备注',
        dataIndex: 'childOrderMsg',
        key: 'childOrderMsg',
      }, {
        title: '商户名称',
        dataIndex: 'orderPromulgator',
        key: 'orderPromulgator',
      },{
        title: '订单名称',
        dataIndex: 'orderName',
        key: 'orderName',
      },{
        title: '网点/代理商',
        dataIndex: 'companyName',
        key: 'companyName',
      },{
        title: '创建时间',
        dataIndex: 'childOrderCreateDateLabel',
        key: 'childOrderCreateDateLabel',
      },
      {
        title: '其他',
        dataIndex: 'childFailedRemake',
        key: 'childFailedRemake',
      },
      {
        title: '状态',
        dataIndex: 'childOrderStatusLbel',
        key: 'childOrderStatusLbel',
      },
      {
        title: '操作',
        render: (text, record) => {
          const status = record.childOrderStatus
          if(status==6){
            return (
              <div>
                <div>
                  <a href='javascript:;' onClick={()=>this.showModal(record)}>审核</a>
                </div>
              </div>
            );
          }
          if(status==5&&getAuthority('/order/order/platformAgreeChildOrder')){
            //如果有平台审核订单权限
            return (
              <div>
                <div>
                  <a href='javascript:;' onClick={()=>this.showModal(record)}>审核</a>
                </div>
              </div>
            );
          }

          if(status==2||status==0&&getAuthority('/order/order/platformAgreeChildOrder')){
            return (
              <div>
                <div>
                  <a href='javascript:;' onClick={()=>this.showModal(record)}>撤回</a>
                </div>
              </div>
            );
          }
          return (
            <div>
              <div>
                <span>不能操作</span>
              </div>
            </div>
          );
        },
      }
    ];
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => this.getCheckboxProps(record),

    };
    const hasSelected = selectedRowKeys.length > 0;
    return(
      <div>
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={this.start}
            disabled={!hasSelected}
            loading={loading}
          >
            批量审核
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `已选择 ${selectedRowKeys.length} 列` : ''}
          </span>
        </div>
        <Table
          onChange={this.onPaginationChange}
          rowSelection={rowSelection}
          dataSource={childOrderPage.dataList}
          columns={columns}
          pagination={paginationProps}
          loading={childOrderListLoading}
          rowKey={record => record.id}
        />
        <Modal
          title="订单审核"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <div onChange={this.onChange} className={styles.pad20}>
            <Radio value={1} name="radio" checked={this.state.value==1}>合格</Radio>
            <Radio value={2} name="radio" checked={this.state.value!=1}>不合格</Radio>
          </div>
          {this.state.value==2&&
          <div style={{padding:'0 20px'}}>
            <div>
              <span>原因:</span>
            </div>
            <div style={{marginTop:20}}>
              <Input  placeholder="请输入不合格原因" onChange={this.onChangeMsg}/>
            </div>
          </div>
          }
        </Modal>
      </div>

    )
  };
/*  renderRadio =()=>{
    return (
      <div>
        <Radio value={1} name="radiogroup" onChange={this.onChange()}>合格</Radio>
        <Radio value={2} name="radiogroup" onChange={this.onChange()}>不合格</Radio>
      </div>
      )
  };*/
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

