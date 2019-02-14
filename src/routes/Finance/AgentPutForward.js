import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {getAuthority} from '../../utils/utils';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Select,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Table,
  Popconfirm
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './AgentPutForward.less';
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
@Form.create()
@connect(({ finance,selecttype, loading }) => ({
  finance,
  selecttype,
  loading: loading.models.finance,
}))
//selectDrawings
// 财务信息
export default class AgentPutForward extends Component {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    query:{
      page_page:1,
      page_rows:10,
      search_drawType_EQ:1,
      search_drawCreateDate_SORT:'DESC'
    }
  };
  //finance/fetchDetailed
  componentDidMount(){
    this.props.dispatch({
      type:'selecttype/fetch',
      payload:{
        type:'drawingsstatus',
      }
    });
    this.initPagination();
  };
  initPagination(){
    const { dispatch } = this.props;
    dispatch({
      type: 'finance/fetchDetailed',
      payload:this.state.query
    });
  }
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const query = this.state.query;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if(values.date){
        const date = [moment(values.date[0]._d).format('YYYY-MM-DD HH:mm:ss'),moment(values.date[1]._d).format('YYYY-MM-DD HH:mm:ss')];
        values ={
          ...values,
          search_drawCreateDate_GTE:date[0],
          search_drawCreateDate_LT:date[1],
        };
        delete values.date;
      };
      this.state.query ={
        ...query,
        ...values,
      }
      this.initPagination();
    });
  };
  handleFormReset =()=>{
    this.props.form.resetFields();
    this.state.query ={
      page_rows:10,
      page_page:1,
    };
  };
  confirm  = id =>{
    const {dispatch} = this.props;
    dispatch({
      type: 'finance/operationAgree',
      payload: {
        drawingsId:id,
      },
      callback:()=>{
        const {query} = this.state;
        this.state.query ={
          ...query,
          page_page:1,
        };
        this.initPagination();
      }
    });
  };
  cancel  = id =>{
    const {dispatch} = this.props;
    dispatch({
      type: 'finance/operationReject',
      payload: {
        drawingsId:id,
      },
      callback:()=>{
        const {query} = this.state;
        this.state.query ={
          ...query,
          page_page:1,
        };
        this.initPagination();
      }
    });
  };

  renderSimpleForm() {
    const { form, selecttype } = this.props;
    const { statusList } = selecttype;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={24} >
         {/* <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="订单名称">
              {getFieldDecorator('orderName')(<Input placeholder="请输入网点名称" />)}
            </FormItem>
          </Col>*/}
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="订单状态">
              {getFieldDecorator('search_drawStatus_EQ')(
                <Select placeholder="请选择订单状态">
                  {statusList.map((item,index) =>
                    <Option value={item.code} key={index}>{item.label}</Option>
                  )}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={5}>
            <FormItem label="代理商编号">
              {getFieldDecorator('search_drawCompanyId_EQ')(<Input placeholder="请输入代理商编号" />)}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={9}>
            <FormItem label="查询时间">
              {getFieldDecorator('date')(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
              )}
            </FormItem>
          </Col>
          <Col xs={24}  xl={12} xxl={5}  style={{textAlign:'right'}}>
            <span className={`${styles.submitButtons} ${styles.mr20}`}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
            <Button className={`${styles.submitButtons} ${styles.mr20}`} onClick={this.handleFormReset}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
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
  renderSuperAdminTable(){
    const {detailedPage} = this.props.finance;
    const {loading} = this.props;
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
      title: '代理商名称',
      dataIndex: 'drawCompanyLabel',
      key: 'drawCompanyLabel',
    },
      {
        title: '申请人',
        dataIndex: 'drawCreateUserLabel',
        key: 'drawCreateUserLabel',
      },
      {
      title: '提现金额',
      dataIndex: 'drawPrice',
      key: 'drawPrice',
    },
      {
        title: '当前结余',
        dataIndex: 'companyPrice',
        key: 'companyPrice',
      },
      {
        title: '申请提现时间',
        dataIndex: 'drawCreateDateLabel',
        key: 'drawCreateDateLabel',
      },{
        title: '备注',
        dataIndex: 'drawName',
        key: 'drawName',
      },
      {
        title: '提现状态',
        dataIndex: 'drawStatusLabel',
        key: 'drawStatusLabel',
        render:(text, record)=>{
          if(record.drawStatus === 2){
            return(<span style={{color:'#52c41a'}}>{text}</span>)
          }

          return(<span>{text}</span>)
        }
      },
      {
        title: '审核人',
        dataIndex: 'drawUpdateUserLabel',
        key: 'drawUpdateUserLabel',
      },
      {
        title: '审核时间',
        dataIndex: 'drawUpdateDateLabel',
        key: 'drawUpdateDateLabel',
      },
      {
        title: '操作',
        render: (text, record) => {
          if (record.drawStatus !== 1){
            return (
              <div>
               <span>不能操作</span>
              </div>
            );
          }

          return (
            <div>
              {getAuthority('/order/drawings/agreeDrawings')&&
              <Popconfirm title="是否同意打款？" onConfirm={() => this.confirm(record.id)}>
                <a>通过</a>
              </Popconfirm>
              }
              {getAuthority('/order/drawings/rejectDrawings')&&
                <span>
                   <Divider type="vertical" />
              <Popconfirm title="是否拒绝打款？" onConfirm={() => this.cancel(record.id)}>
                <a>拒绝</a>
              </Popconfirm>
                </span>
              }
            </div>
          );
        },
      }
    ];
    return(
      <Table
        loading={loading}
        onChange={this.onPaginationChange}
        dataSource={detailedPage.dataList}
        columns={columns}
        rowKey={record => record.id}
        pagination={paginationProps}/>

    )
  };
/*  renderFinanceTable(){
    const dataSource = [{
      key: '1',
      no: '0225105',
      totalIncome: '100000',
      totalBalance: '40000',
      presentBalance: '40000',
      accountPeriod: '40000',
      accountState:'审核中',
    }];
    const columns = [{
      title: 'ID',
      dataIndex: 'no',
      key: 'no',
    }, {
      title: '代理商名称',
      dataIndex: 'totalIncome',
      key: 'totalIncome',
    }, {
      title: '提现金额',
      dataIndex: 'totalBalance',
      key: 'totalBalance',
    },
      {
        title: '提现时间',
        dataIndex: 'accountPeriod',
        key: 'accountPeriod',
      },
      {
        title: '提现状态',
        dataIndex: 'status',
        filters: [
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
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          return (
            <div>
              <Button type="primary">
                确认打款
              </Button>
            </div>
          );
        },
      }
    ];
    return(
      <Table dataSource={dataSource} columns={columns} pagination={true}/>
    )
  };*/
  render() {
    return (
      <PageHeaderLayout title="代理商提现明细">
        <Card>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
              {this.renderSuperAdminTable()}
             {/* {this.renderFinanceTable()}*/}
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}

