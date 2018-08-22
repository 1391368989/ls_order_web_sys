import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
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
    // ajax request after empty completing
    this.showModal()
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  };

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  onChange = (e) => {
    //, e.target.value
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
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
          return (
            <div>
              <a href='javascript:;' onClick={this.showModal}>审核</a>
            </div>
          );
        },
      }
    ];
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
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
            <Radio value={1} name="radio" checked={this.state.value==1}>不合格</Radio>
            <Radio value={2} name="radio" checked={this.state.value!=1}>合格</Radio>
          </div>
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

