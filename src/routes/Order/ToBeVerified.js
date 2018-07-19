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
  Table,
  Radio
} from 'antd';
import styles from './OrderInfo.less';

const RangePicker = DatePicker.RangePicker;
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请输入要查询的时间段!' }]
}
const FormItem = Form.Item;
@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))
export default class OrderInfo extends Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
    loading: false,
    visible: false,
    value: 1,
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
            <FormItem label="网点名称">
              {getFieldDecorator('no',{
                rules: [{
                  required: true,
                  message: '请输入网点名称!',
                }],
              })(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="订单状态">
              {getFieldDecorator('no2',{
                rules: [{
                  required: true,
                  message: '请输入网点名称!',
                }],
              })(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="商户名称">
              {getFieldDecorator('no3',{
                rules: [{
                  required: true,
                  message: '请输入网点名称!',
                }],
              })(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={6}>
            <FormItem label="姓名/手机号">
              {getFieldDecorator('no4',{
                rules: [{
                  required: true,
                  message: '姓名/手机号!',
                }],
              })(<Input placeholder="姓名/手机号" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={9}>
            <FormItem label="查询时间">
              {getFieldDecorator('date', rangeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col xs={24} xl={12} xxl={15} style={{textAlign:'right'}}>
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
  }

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }
  onChange = (e) => {
    //, e.target.value
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }
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
      title: 'ID',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '用户姓名',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '手机号码',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '身份证号',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod1',
      },
      {
        title: '订单备注',
        dataIndex: 'accountPeriod1',
        key: 'accountPeriod2',
      }, {
        title: '商户名称',
        dataIndex: 'accountPeriod2',
        key: 'accountPeriod3',
      },{
        title: '订单名称',
        dataIndex: 'accountPeriod3',
        key: 'accountPeriod4',
      },{
        title: '网点/代理商',
        dataIndex: 'accountPeriod4',
        key: 'accountPeriod5',
      },{
        title: '创建时间',
        dataIndex: 'accountPeriod5',
        key: 'accountPeriod6',
      },{
        title: '创建时间',
        dataIndex: 'accountPeriod8',
        key: 'accountPeriod7',
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
        <Table  rowSelection={rowSelection} dataSource={dataSource} columns={columns} pagination={true}/>
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

