import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { Link } from 'dva/router';
import ReimbursementInfo from './ReimbursementInfo';
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

import styles from './MerchantExamine.less';
const RangePicker = DatePicker.RangePicker;
const rangeConfig = {
  rules: [{ type: 'array', required: true, message: '请输入要查询的时间段!' }],
};
const status= ['不合格','合格'];
const statusMap = ['default', 'processing'];
const FormItem = Form.Item;
@Form.create()
@connect(({finance, loading }) => ({
  finance,
  loading: loading.effects['finance/fetchDetailed'],
}))
export default class ReimbursementInformation extends Component {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    page:1,
    companyId:null,
    query:{
      page_page:1,
      page_rows:10,
      search_drawType_EQ:2,
      search_drawCreateDate_SORT:'DESC',
    }
  };
  componentDidMount() {
    this.initPagination();
  }
  initPagination =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchDetailed',
      payload:this.state.query
    });
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
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'workplace/fetch',
        payload: values,
      });
    });
  };
  addExpenseAccount =(item)=>{
    this.setState({
      page:2,
      parentData:item
    })
  };
  renderSimpleForm = ()=> {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24}>
          <Col xs={24}  md={24} xl={6}>
            <FormItem label="网点名称">
              {getFieldDecorator('no',{
                rules: [{
                  required: true,
                  message: '请输入网点名称!',
                }],
              })(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>
          <Col xs={24}  md={24} xl={10}>
            <FormItem label="时间节点">
              {getFieldDecorator('date', rangeConfig)(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col xs={24}  md={24} xl={8} style={{textAlign:'right'}}>
            <span className={`${styles.submitButtons} ${styles.mr20}`}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
            <span className={`${styles.submitButtons} ${styles.mr20}`}>
              <Button>
                重置
              </Button>
            </span>
           {/* <span className={`${styles.submitButtons}`}>
              <Button type="primary" onClick={this.addExpenseAccount()}>
                添加报单
              </Button>
            </span>*/}
          </Col>
        </Row>
      </Form>
    );
  };
  onBack=()=>{
    this.setState({
      page:1
    });
    this.initPagination();
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
  renderFinanceTable(){
    const {finance,loading} = this.props;
    const {detailedPage} =finance;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: detailedPage.rows,
      total: detailedPage.totalRows,
      current:detailedPage.page
    };
    const columns = [
      {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '网点名称',
      dataIndex: 'drawCompanyLabel',
      key: 'drawCompanyLabel',
    }, {
      title: '费用总计',
      dataIndex: 'drawPrice',
      key: 'drawPrice',
    },
      {
        title: '使用时间',
        dataIndex: 'drawCreateDateLabel',
        key: 'drawCreateDateLabel',
      },
      {
        title: '状态',
        dataIndex: 'drawStatusLabel',
        key: 'drawStatusLabel',
       /* filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          }
        ],
        onFilter: (value, record) => record.status.toString() === value,
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },*/
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              {/*<Divider type="vertical" />*/}
              <a onClick={()=>this.addExpenseAccount(record)}>查看详情</a>
            </div>
          );
        },
      }
    ];
    return(
      <Table
        rowKey={record => record.id}
        dataSource={detailedPage.dataList}
        columns={columns}
        pagination={paginationProps}
        loading={loading}
        onChange={this.onChange}
      />
    )
  };
  render(){
    return(
      <div>
        {
          this.state.page === 1&&
          <PageHeaderLayout title="报销信息">
            <div className={`${styles.box} ${styles.bgfff}`}>
              <div className={styles.tableList}>
                <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
                <div>
                  {this.renderFinanceTable()}
                </div>
              </div>
            </div>
          </PageHeaderLayout>
        }
        {
          this.state.page === 2&&
          <ReimbursementInfo onBack={this.onBack}  parentData = {this.state.parentData}/>
        }
      </div>
    )
  }
}

