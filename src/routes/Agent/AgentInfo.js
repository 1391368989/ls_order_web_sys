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
  loading: loading.effects['agentinfo/fetchCompany'],
}))

export default class AgentInfo extends Component {
  state = {
    loading: false,
    visible: false,
    query:{
      page_rows:10,
      page_page:1,
    },
    data:null,
    load:false,
  };
  componentDidMount() {
   // this.connection();
    this.initPagination();
    const { dispatch } = this.props;
    dispatch({
      type: 'agentinfo/fetchInit',
      payload:{
        type: "companytype"
      },
    });
  }
  initPagination(){
    const { dispatch } = this.props;
    dispatch({
      type: 'agentinfo/fetchCompany',
      payload:this.state.query
    });
  }
  connection =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'agentinfo/ceshi',
      payload:{
        index:0
      },
      callback:(response)=>{
        this.connection();
        if(response === '123'){
          this.state.query ={
            page_rows:10,
            page_page:1,
          };
          this.initPagination()
        }
      }
    });
  };
  addAgentInfo =()=>{
    this.setState({
      visible: true,
      data:null,
    });
  };
  handleOk = (e) => {
    this.setState({
      visible: false,
    });
    if(this.state.load){
      this.initPagination()
    }
  };

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
    if(this.state.load){
      this.initPagination()
    }
  };
  handleFormReset =()=>{
    this.props.form.resetFields();
    this.state.query ={
      page_rows:10,
      page_page:1,
    };
    this.initPagination()
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
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const query = this.state.query;
      this.state.query ={
        ...query,
        ...values
      };
      this.initPagination();
    });
  };
  onInitPagination =()=>{
    this.state.load = true;
  };
  renderSimpleForm() {
    const { form} = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="代理商">
              {getFieldDecorator('search_name_LIKE',{
                rules: [{
                  required: true,
                  message: '请输入代理商名称!',
                }],
              })(<Input placeholder="请输入代理商名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
          </Col>
          <Col md={8} sm={24} style={{textAlign:'right'}}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button  style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
               <Button style={{ marginLeft: 8 }} onClick={this.addAgentInfo}>
                添加
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };
  editCompany (item){
    this.setState({
      data:item,
      visible: true,
    });
  };
  render() {
    const { agentinfo,loading } = this.props;
    const { dataPage={},provinceList,powerGroupList} = agentinfo;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: dataPage.rows,
      total: dataPage.totalRows,
      current:dataPage.page
    };
    const columns = [
      {
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    },
      {
        title: '类型',
        dataIndex: 'typelabel',
        key: 'typelabel',
      },
      {
      title: '网点名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '负责人',
      dataIndex: 'linkman',
      key: 'linkman',
    },
      {
        title: '手机号码',
        dataIndex: 'linkphone',
        key: 'linkphone',
      },
      {
        title: '账户余额',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: '开户行',
        dataIndex: 'bankAddress',
        key: 'bankAddress',
      },
      {
        title: '银行卡号',
        dataIndex: 'bankCode',
        key: 'bankCode',
      },{
        title: '所属城市',
        dataIndex: 'cityIdLabel',
        key: 'cityIdLabel',
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
             {/* <a type="primary" href="javascript:;">
                禁用
              </a>
              <Divider type="vertical" />
              <a type="danger" href="javascript:;">
                重置密码
              </a>
              <Divider type="vertical" />*/}
              <a onClick={()=>this.editCompany(record)}>
                编辑
              </a>
            </div>
          );
        },
      }
    ];
    return (
      <PageHeaderLayout title="代理商/网点信息">
        <Card>
          <div>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table loading={loading} dataSource={dataPage.dataList} columns={columns} pagination={paginationProps} onChange={this.onChange}/>
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
          {this.state.visible&&
            <AddMember dataSource={this.state.data} provinceList={provinceList} powerGroupList={powerGroupList} onInitPagination={this.onInitPagination}/>
          }
        </Modal>
      </PageHeaderLayout>
    )
  }
}
