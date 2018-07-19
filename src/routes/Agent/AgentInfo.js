import React, { Component } from 'react';
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
  Select
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import AddMember from '../../components/AddMember';
import styles from './Agent.less';

const Option = Select.Option;
const FormItem = Form.Item;
@Form.create()
@connect(({ agentinfo, loading }) => ({
  agentinfo,
  loading: loading.models.agentinfo,
}))

export default class AgentInfo extends Component {
  state = {
    loading: false,
    visible: false,
  };
/*
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'agentinfo/fetchTags',
    });
  }*/

  addAgentInfo =()=>{
    this.setState({
      visible: true,
    });
  };
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
  };
/*  handleChange =(value)=>{
    this.setState({
        modalPowerGroup:value
      }
    )
  };*/
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
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
    {/*          <Button  style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>*/}
               <Button style={{ marginLeft: 8 }} onClick={this.addAgentInfo}>
                添加
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
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
  /*renderAddAgent(){
    const { form ,agentinfo} = this.props;
    const { powerGroupList} = agentinfo;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return(
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row>
            <Col offset={2} md={12}>
              <FormItem label='权限组' {...formItemLayout}>
                {getFieldDecorator('powerGroup',{
                  rules: [{
                    required: true,
                    message: '请选择权限组！',
                  }],
                })(
                  <Select placeholder="请选择权限组" onChange={this.handleChange}>
                    {powerGroupList.map((item,index) =>
                      <Option value={item.value} key={index}>{item.name}</Option>
                    )}
                  </Select>
                )}
              </FormItem>
              <FormItem label='账户名' {...formItemLayout}>
                {getFieldDecorator('userName',{
                  rules: [{
                    required: true,
                    message: '请输入账户名!',
                  }],
                })(<Input placeholder="请账户名" />)}
              </FormItem>
              <FormItem label='初始密码' {...formItemLayout}>
                {getFieldDecorator('userPass',{
                  rules: [{
                    required: true,
                    message: '请输入初始密码!',
                  }],
                })(<Input placeholder="请输入初始密码" />)}
              </FormItem>
              <FormItem label='负责人' {...formItemLayout}>
                {getFieldDecorator('principal',{
                  rules: [{
                    required: true,
                    message: '请输入负责人姓名!',
                  }],
                })(<Input placeholder="请输入负责人姓名" />)}
              </FormItem>
              <FormItem label='手机号' {...formItemLayout}>
                {getFieldDecorator('phone',{
                  rules: [{
                    required: true,
                    message: '请输入手机号!',
                  }],
                })(<Input placeholder="请输入手机号" />)}
              </FormItem>
              {this.state.modalPowerGroup=='agent'&&
              <div>
                <FormItem label='所属城市' {...formItemLayout}>
                  {getFieldDecorator('city',{
                    rules: [{
                      required: true,
                      message: '请输入所属城市!',
                    }],
                  })(
                    <Select placeholder="请输入所属城市">
                      {powerGroupList.map((item,index) =>
                        <Option value={item.value} key={index}>{item.name}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
                <FormItem label='详细地址' {...formItemLayout}>
                  {getFieldDecorator('address',{
                    rules: [{
                      required: true,
                      message: '请输入详细地址!',
                    }],
                  })(<Input placeholder="请输入详细地址" />)}
                </FormItem>
                <FormItem label='开户行' {...formItemLayout}>
                  {getFieldDecorator('openingBank',{
                    rules: [{
                      required: true,
                      message: '请输入开户行!',
                    }],
                  })(<Input placeholder="请输入开户行" />)}
                </FormItem>
                <FormItem label='银行卡号' {...formItemLayout}>
                  {getFieldDecorator('openingBank',{
                    rules: [{
                      required: true,
                      message: '请输入银行卡号!',
                    }],
                  })(<Input placeholder="请输入银行卡号" />)}
                </FormItem>
                <FormItem label='所属运营组' {...formItemLayout}>
                  {getFieldDecorator('belongOperationsGroup',{
                    rules: [{
                      required: true,
                      message: '请选择所属运营组!',
                    }],
                  })(
                    <Select placeholder="请选择所属运营组">
                      {powerGroupList.map((item,index) =>
                        <Option value={item.value} key={index}>{item.name}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </div>
              }
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">提交</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
  handleSubmit =e=>{
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      console.log(err)
      if (err) return;
      dispatch({
        type: 'agentinfo/fetch',
        payload: values,
      });
    });
  };*/
  render() {
    const dataSource = [{
      key: '1',
      no: '0225105',
      totalIncome: '100000',
      totalBalance: '40000',
      presentBalance: '40000',
      accountPeriod: '40000',
    }];
    const columns = [{
      title: '序号',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '网点名称',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '负责人',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '手机号码',
        dataIndex: 'presentBalances',
        key: 'presentBalances',
      },
      {
        title: '账户余额',
        dataIndex: 'accountPeriod1',
        key: 'accountPeriod1',
      }, {
        title: '可提现金额',
        dataIndex: 'accountPeriod2',
        key: 'accountPeriod2',
      },{
        title: '冻结金额',
        dataIndex: 'accountPeriodddd',
        key: 'accountPeriod3',
      },
      {
        title: '开户行',
        dataIndex: 'accountPeriodddd',
        key: 'accountPeriodss',
      },
      {
        title: '银行卡',
        dataIndex: 'account5',
        key: 'account5',
      },{
        title: '所属城市',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '地址',
        dataIndex: 'address666',
        key: 'address666',
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <a type="primary" href="javascript:;">
                禁用
              </a>
              <Divider type="vertical" />
              <a type="danger" href="javascript:;">
                重置密码
              </a>
              <Divider type="vertical" />
              <a href="javascript:;">
                编辑
              </a>
            </div>
          );
        },
      }
    ];
    return (
      <PageHeaderLayout title="代理商信息">
        <Card>
          <div>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table dataSource={dataSource} columns={columns} pagination={true}/>
          </div>
          <div>
          </div>
        </Card>
        <Modal
          visible={this.state.visible}
          title='新增代理商/网点'
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width="50%"
        >
          <AddMember/>
        </Modal>
      </PageHeaderLayout>
    )
  }
}
