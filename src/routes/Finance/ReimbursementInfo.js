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
  Tooltip
} from 'antd';

import styles from './MerchantExamine.less';
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))
export default class ReimbursementInfo extends Component {
  state = {
    li:{
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
    ]
  };
  toggleCollapse = (item,index) =>{
    item.state = !item.state
    this.setState({
      'dataList[index]': item,
    });
  };
  renderInput =(text,start) =>{
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
  handleKeyPress(e, key) {
   /* if (e.key === 'Enter') {
      this.saveRow(e, key);
    }*/
  }
//保存数据
  handleFieldChange(e, fieldName, key) {
   /* const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }*/
  }
  //编辑列表行
  redactRow (item,index) {
    item.editable = !item.editable
    this.setState({'dataList[index]': item });
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

  render(){
    return(
      <PageHeaderLayout title="报销详情">
        <div className={`${styles.box} ${styles.bgfff}`}>
          <div className={styles.tableList}>
            <div className={styles.head}>
              {this.renderTable()}
            </div>
          </div>
        </div>
        <Row className={`${styles.box} ${styles.bgfff}`} style={{marginTop:'100px'}}>
          <Col md={24} lg={12}>
            <div className={styles.mb20}>网点发生费用合计：350</div>
            <div>兼职工资：275 代理费：75</div>
          </Col>
          <Col md={24} lg={12} className={styles.textr}>
            <div className={styles.mb20}>
              <Button type=''>已打款</Button>
            </div>
            <div><Button>审批</Button></div>
          </Col>
        </Row>
      </PageHeaderLayout>
    )
  }
}

