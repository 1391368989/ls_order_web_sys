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
  };

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
      console.log('moment')
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
      dataIndex: 'dotName',
      key: 'dotName',
    }, {
      title: '负责人',
      dataIndex: 'personInCharge',
      key: 'personInCharge',
    },
      {
        title: '手机号码',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '账户余额',
        dataIndex: 'accountBalance',
        key: 'accountBalance',
      }, {
        title: '可提现金额',
        dataIndex: 'availableAmount',
        key: 'availableAmount',
      },{
        title: '冻结金额',
        dataIndex: 'freezingAmount',
        key: 'freezingAmount',
      },
      {
        title: '开户行',
        dataIndex: 'openingBank',
        key: 'openingBank',
      },
      {
        title: '银行卡',
        dataIndex: 'bankCard',
        key: 'bankCard',
      },{
        title: '所属城市',
        dataIndex: 'ownedCity',
        key: 'ownedCity',
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
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
