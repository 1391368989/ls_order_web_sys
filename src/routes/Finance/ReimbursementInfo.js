import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {getAuthority} from '../../utils/utils';
import { connect } from 'dva';
import {
  Row,moment
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
  Tooltip
} from 'antd';

import styles from './MerchantExamine.less';
@connect(({ dotfinance, childLoading,loading }) => ({
  dotfinance,
  childLoading: loading.effects['dotfinance/fetchChildOrder'],
  loading: loading.effects['dotfinance/fetch'],
}))
export default class ReimbursementInfo extends Component {
  cacheOriginData = {};
  state = {
   /* li:{
      id: 'ID',
      name: '用户姓名',
      tel: '手机号码',
      leader: '负责人',
      salary: '用户工资',
      ditch: '渠道',
      ditchSalary: '渠道费用',
      total: '费用总计',
      time: '使用时间',
      details: '详情',
    },
    dataList:[
      {
        id:'05552',
        name:'张飞',
        tel:'13812341234',
        leader:'刘备',
        salary: '用户工资',
        ditch:'土匪',
        ditchSalary:'100',
        total:'100',
        time:'2019-10-10',
        'details':[
          {'no':40000123451,'agent':'华西不限一','remark':'我是备注1','state':'不合格'},
          {'no':40000123451,'agent':'华西不限二','remark':'我是备注2','state':'合格'},
          {'no':40000123451,'agent':'华西不限三','remark':'我是备注3','state':'合格'},
          {'no':40000123451,'agent':'华西不限四','remark':'我是备注4','state':'不合格'},
        ],
        state:true,
        editable:true
      },
      {
        id:'05553',
        name:'张飞',
        tel:'13812341234',
        leader:'刘备',
        salary: '用户工资',
        ditch:'土匪',
        ditchSalary:'100',
        total:'100',
        time:'2019-10-10',
        'details':[
          {'no':40000123451,'agent':'华西不限一','remark':'我是备注1','state':'不合格'},
          {'no':40000123451,'agent':'华西不限二','remark':'我是备注2','state':'合格'},
          {'no':40000123451,'agent':'华西不限三','remark':'我是备注3','state':'合格'},
          {'no':40000123451,'agent':'华西不限四','remark':'我是备注4','state':'不合格'},
        ],
        state:false,
        editable:false
      }
    ]*/
    query:{
      page_page:1,
      page_rows:10,
    },
    childrenQuery:{
      page_page:1,
      page_rows:10,
    },
    expandedRowKeys:[],
    dataPage:{
      dataList:[],
    },
  };
  componentDidMount(){
    const { parentData } = this.props;
    const {query} = this.state;
    this.state.query = {
      ...query,
      search_drawingsId_EQ:parentData.id,
    };
    this.initPagination()
  }
  initPagination =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'dotfinance/fetch',
      payload:this.state.query,
      callback:(res)=>{
        res.data.page.dataList = res.data.page.dataList.map(item=>{
          if(item.userPrice === null){
            item.editable = true;
            const key = item.id;
            this.cacheOriginData[key] = { ...item };
          }else{
            item.editable = false;
          }
          return {
            ...item,
          }
        });
        this.setState({
          dataPage:res.data.page
        });
      }
    });
  };

  initChildPagination =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'dotfinance/fetchChildOrder',
      payload:this.state.childrenQuery
    });
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
  onChildChange = (e)=>{
    const childrenQuery = this.state.childrenQuery;
    this.state.childrenQuery ={
      ...childrenQuery,
      page_rows:e.pageSize,
      page_page:e.current,
    };
    this.initChildPagination()
  };
  toggleCollapse = (item,index) =>{
    item.state = !item.state
    this.setState({
      'dataList[index]': item,
    });
  };
  /*renderInput =(text,start) =>{
    if(start){
      return text
    }else{
      return (
        <Input
          value={text}
          autoFocus
          onChange={e => this.handleFieldChange(e, 'name', record.key)}
          onKeyPress={e => this.handleKeyPress(e, record.key)}
          placeholder="成员姓名"
        />
        )
    }
  };
   renderTable = () =>{
   const li = this.state.li;
   const list =this.state.dataList;
   return(
   <div>
   <Row style={{display:'table',width:'100%'}} className={`${styles.borderB} ${styles.pb20} ${styles.pt20}`}>
   <Col span={3} style={{display:'table-cell'}}>{li.id}</Col>
   <Col span={3} style={{display:'table-cell'}}>{li.name}</Col>
   <Col span={4} style={{display:'table-cell'}}>{li.tel}</Col>
   <Col span={2} style={{display:'table-cell'}}>{li.leader}</Col>
   <Col span={4} style={{display:'table-cell'}}>{li.salary}</Col>
   <Col span={2} style={{display:'table-cell'}}>{li.ditch}</Col>
   <Col span={2} style={{display:'table-cell'}}>{li.ditchSalary}</Col>
   <Col span={2} style={{display:'table-cell'}}>{li.total}</Col>
   <Col span={2} style={{display:'table-cell'}}>{li.details}</Col>
   </Row>
   {list.map((item,index) =>
   <div key={index} style={{display:'table',width:'100%'}}>
   <Row className={`${styles.borderB} ${styles.pb20} ${styles.pt20}`}>
   <Col span={3} style={{display:'table-cell'}}>{item.id}</Col>
   <Col span={3} style={{display:'table-cell'}}>{item.name}</Col>
   <Col span={4} style={{display:'table-cell'}}>{item.tel}</Col>
   <Col span={2} style={{display:'table-cell',paddingRight:20}}>{this.renderInput(item.leader,item.editable)}</Col>
   <Col span={4} style={{display:'table-cell',paddingRight:20}}>{this.renderInput(item.salary,item.editable)}</Col>
   <Col span={2} style={{display:'table-cell',paddingRight:20}}>{this.renderInput(item.ditch,item.editable)}</Col>
   <Col span={2} style={{display:'table-cell',paddingRight:20}}>{this.renderInput(item.ditchSalary,item.editable)}</Col>
   <Col span={2} style={{display:'table-cell'}}>{item.total}</Col>
   <Col span={2} style={{display:'table-cell'}}>
   {!item.editable&&
   <div>
   <a href="javascript:;" onClick={() =>this.toggleCollapse(item,index)}>查看</a>
   </div>
   }
   {item.editable&&
   <div>
   <a href="javascript:;" onClick={() =>this.toggleCollapse(item,index)}>查看</a>
   <Divider type="vertical" />
   <a href="javascript:;" onClick={() =>this.redactRow(item,index)}>编辑</a>
   </div>
   }
   </Col>
   </Row>
   {item.state&&
   <div>
   <Row className={`${styles.borderB} ${styles.pb20} ${styles.pt20}`}>
   <Col span={6} style={{display:'table-cell'}}>订单</Col>
   <Col span={6} style={{display:'table-cell'}}>网点</Col>
   <Col span={6} style={{display:'table-cell'}}>订单备注</Col>
   <Col span={6} style={{display:'table-cell'}}>状态</Col>
   </Row>
   <Row className={`${styles.borderB} ${styles.pb20} ${styles.pt20}`}>
   <Col span={6} style={{display:'table-cell'}}>02656</Col>
   <Col span={6} style={{display:'table-cell'}}>华西不限一</Col>
   <Col span={6} style={{display:'table-cell'}}>0580092057</Col>
   <Col span={6} style={{display:'table-cell'}}>不合格</Col>
   </Row>
   </div>
   }
   </div>
   )}
   </div>
   )
   };
  */
//保存数据
  saveRow(e, item) {
    e.persist();
    if(!item.userReception){
      message.error('请填写完整负责人姓名！');
      e.target.focus();
      return;
    }
    if(!item.userPrice&&item.userPrice !==0 ){
      message.error('请填写完整用户工资！');
      e.target.focus();
    }
    if(!item.receptionType){
      message.error('请填写完整渠道来源！');
      e.target.focus();
      return;
    }
    if(!item.receptionPrice&&item.receptionPrice !==0){
      message.error('请填写完整渠道费用！');
      e.target.focus();
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'dotfinance/submit',
      payload:item,
      callback:()=>{
        item.editable = false;
        item.receptionStatus = 1;
        this.setState({ dataPage: this.state.dataPage });
      }
    });
  }
  //编辑列表行
  redactRow (e,item) {
    const key = item.id;
    e.preventDefault();
    const { dataPage } = this.state;
    const newData = dataPage.dataList.map(item => ({ ...item }));
    let target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      this.props.dispatch({
        type:'dotfinance/operation',
        payload:{
          "companyId": item.companyId,
          "receptionId": item.id
        },
        callback:()=>{
          target.receptionStatus = 0;
          target.editable = !target.editable;
          this.state.dataPage.dataList = newData;
          this.setState({ dataPage: this.state.dataPage });
        }
      });

    }
  };
  //取消
  cancelRow(e,item){
    this.toggleEditable(e,item.id);
  }

  handleKeyPress(e, item) {
    if (e.key === 'Enter') {
      this.saveRow(e, item);
    }
  }

  handleFieldChange(e, fieldName, key) {
    const { dataPage } = this.state;
    const newData = dataPage.dataList.map(item => ({ ...item }));
    let target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      if(target.userPrice&&target.receptionPrice){
        target.allPrice = parseInt(target.userPrice) + parseInt(target.receptionPrice);
      }
      this.state.dataPage.dataList = newData;
      this.setState({ dataPage: this.state.dataPage });
    }
  }

  getRowByKey(key, newData) {
    const { dataPage } = this.state;
    return (newData || dataPage).filter(item => item.id === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { dataPage } = this.state;
    const newData = dataPage.dataList.map(item => ({ ...item }));
    let target = this.getRowByKey(key, newData);
    if (target) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      target.receptionStatus = 0;
      delete this.cacheOriginData[key];
      this.state.dataPage.dataList = newData;
      this.setState({ dataPage: this.state.dataPage });
    }
  };

  getChildOrder=(expanded,record)=>{
    if(expanded){
      const childrenQuery = this.state.childrenQuery;
      this.state.childrenQuery = {
        ...childrenQuery,
        page_page:1,
        search_childOrderCreateDate_GTE:record.createDate,
        search_childOrderCreateDate_LT:record.createDate+1000*60*60*24,
        search_userPhone_EQ:record.userPhone,
      };
      this.initChildPagination()
    }
  };
  onExpandedRowsChange=(e)=>{
    this.setState({
      expandedRowKeys:[e[e.length-1]]
    })
  };
//operationReception
  onSubmit=()=>{
    this.props.dispatch({
      type:'dotfinance/operationOnSubmit',
      payload:{
        companyId:this.props.parentData.drawCompanyId,
        drawingsId:this.props.parentData.id
      }
    })
  };
  adopt=()=>{
    this.props.dispatch({
      type:'finance/operationAgree',
      payload:{
        drawingsId:this.props.parentData.id
      },
      callback:()=>{
        this.back();
      }
    })
  };
  reject=()=>{
    this.props.dispatch({
      type:'finance/operationReject',
      payload:{
        drawingsId:this.props.parentData.id
      }
    })
  };
  renderNestedTable =()=>{
    const {dotfinance,childLoading,loading} = this.props;
    const {childDataPage} = dotfinance;
    const { dataPage } = this.state;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: dataPage.rows,
      total: dataPage.totalRows,
      current:dataPage.page
    };
    const expandedRowRender = () => {
      const columns = [
        { title: '身份证号', dataIndex: 'userIdcode', key: 'userIdcode' },
        { title: '订单名称', dataIndex: 'orderPromulgator', key: 'orderPromulgator' },
        { title: '备注', key: 'childOrderMsg',dataIndex:'childOrderMsg'},
        { title: '状态', dataIndex: 'childOrderStatusLbel', key: 'childOrderStatusLbel' },
      ];
      const childPaginationProps = {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: childDataPage.rows,
        total: childDataPage.totalRows,
        current:childDataPage.page
      };
      const data = [];
      for (let i = 0; i < 3; ++i) {
        data.push({
          key: i,
          date: '2014-12-24 23:12:00',
          name: 'This is production name',
          upgradeNum: 'Upgraded: 56',
        });
      }
      return (
        <Table
          bordered ={true}
          columns={columns}
          dataSource={childDataPage.dataList}
          pagination={childPaginationProps}
          rowKey={record => record.id}
          loading={childLoading}
          onChange={this.onChildChange}
        />
      );
    };
    const columns = [
      { title: '序号', dataIndex: 'id', key: 'id' },
      { title: '网点名称', dataIndex: 'companyName', key: 'companyName' },
      { title: '用户姓名', dataIndex: 'userName', key: 'userName' },
      { title: '手机号码', dataIndex: 'userPhone', key: 'userPhone' },
      {
        title: '负责人' ,
        dataIndex: 'userReception',
        key: 'userReception',
        width:100,
        render:(text,record)=>{
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'userReception', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record)}
                placeholder="接待员"
              />
            );
          }
          return text;
        }
      },
      { title: '用户工资',
        dataIndex: 'userPrice',
        key: 'userPrice',
        width:120,
        render:(text,record)=>{
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                type="number"
                onChange={e => this.handleFieldChange(e, 'userPrice', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record)}
                placeholder="用户工资"
              />
            );
          }
          return text;
        }
      },
      { title: '渠道',
        dataIndex: 'receptionType',
        key: 'receptionType',
        width:120,
        render:(text,record)=>{
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'receptionType', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record)}
                placeholder="渠道来源"
              />
            );
          }
          return text;
        }
      },
      { title: '渠道费用',
        dataIndex: 'receptionPrice',
        key: 'receptionPrice',
        width:120,
        render:(text,record)=>{
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                type="number"
                onChange={e => this.handleFieldChange(e, 'receptionPrice', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record)}
                placeholder="渠道费用"
              />
            );
          }
          return text;
        }
      },
      { title: '费用总计',
        dataIndex: 'allPrice',
        key: 'allPrice' ,
        width:120,
        render:(text,record)=>{
       /*   if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, 'allPrice', record.id)}
                onKeyPress={e => this.handleKeyPress(e, record)}
                placeholder="费用总计"
              />
            );
          }*/
          return text;
        }

      },
      { title: '使用时间', key: 'createDateLabel', dataIndex: 'createDateLabel'},
      { title: '状态', key: 'receptionStatus', dataIndex: 'receptionStatus',
        render:(text)=>{
        if(text === 0){
          return(
            <div>
              待编辑或未通过
            </div>
          )
        }else{
          return(
            <div>

            </div>
          )
        }

        }
      },
       {
       title: '操作',
       render: (text,record) =>{
         if(getAuthority('/order/drawings/insertCompanyReception')){
           if(record.editable){
             return (
               <span className="table-operation">
       <a href="javascript:;" onClick={(e)=>this.saveRow(e,record)}>保存</a>
         <Divider type="vertical" />
       <a href="javascript:;" onClick={e =>this.cancelRow(e,record)}>取消</a>
       </span>
             )
           }
           return(
             <span className="table-operation">
       <a href="javascript:;" onClick={(e)=>this.redactRow(e,record)}>编辑</a>
       </span>
           )
         }else{

         }
       } ,
       },
    ];
    return (
      <Table
        className="components-table-demo-nested"
        columns={columns}
        expandedRowRender={expandedRowRender}
        dataSource={dataPage.dataList}
        rowKey={record => record.id}
        expandedRowKeys = {this.state.expandedRowKeys}
        onExpand={this.getChildOrder}
        onExpandedRowsChange={this.onExpandedRowsChange}
        pagination={paginationProps}
        onChange={this.onChange}
        loading={loading}
      />
    );
  };
  back =()=>{
    const { onBack } = this.props;
    onBack();
  };
  render(){
    const { parentData } = this.props;
    return(
      <PageHeaderLayout title="报销详情">
        <div className={`${styles.box} ${styles.bgfff}`}>
          <Button onClick={this.back} type="primary" >返回</Button>
          <div className={styles.tableList}>
            <div className={styles.head}>
              {this.renderNestedTable()}
            </div>
          </div>
        </div>
        <Row className={`${styles.box} ${styles.bgfff}`} style={{marginTop:'100px'}}>
          <Col md={24} lg={12}>
            <div className={styles.mb20}>网点发生费用合计：{parentData.drawUserPrice+parentData.drawAgencyPrice}</div>
            <div>兼职工资：{parentData.drawUserPrice} 渠道费用：{parentData.drawAgencyPrice}</div>
          </Col>
          <Col md={24} lg={12} className={styles.textr}>
            {this.props.parentData.drawStatus ===2&&
            <div>
              <Button type=''>已打款</Button>
            </div>
            }
            {this.props.parentData.drawStatus ===0&&
            <div>
              {getAuthority('/order/drawings/commitCompanyReceptions')&&
              <div><Button onClick={this.onSubmit}>提交</Button></div>
              }
            </div>
            }
            {this.props.parentData.drawStatus ===1&&
            <div>
              {
                getAuthority('/order/drawings/agreeDrawings')&&
                  <div>
                    <div ><Button onClick={this.adopt}>通过</Button></div>
                    <div style={{marginTop:20}}><Button onClick={this.reject}>驳回</Button></div>
                  </div>
              }
              {!getAuthority('/order/drawings/agreeDrawings')&&
              <div><Button>等待财务审核</Button></div>
              }
            </div>
            }
          </Col>
        </Row>
      </PageHeaderLayout>
    )
  }
}

//operationReception
//const { parentData } = this.props;
