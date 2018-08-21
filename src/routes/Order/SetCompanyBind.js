import React,{Component} from 'react'
import {Table, Button} from 'antd'
import { connect } from 'dva';

@connect(({ order, loading }) => ({
  order,
  loading: loading.effects['order/companyList'],
}))
export default class SetCompanyBind extends Component{
  constructor(props) {
    super(props);
    const state = this.state;
    const {orderId} = props;
    this.state = {
      ...state,
      orderId,
      query:{
        page_rows:10,
        page_page:1,
      }
    };
  };
  componentDidMount(){
    this.initCompanyList();
    this.props.dispatch({
      type:'order/selectOrderIdByOrderId',
      payload:{
        orderId:this.state.orderId,
      }
    })
  }
  initCompanyList(){
    const {dispatch} = this.props;
    dispatch({
      type:'order/companyList',
      payload:this.state.query,
    })
  }
  bindCompany =(companyId)=>{
    this.props.dispatch({
      type:'order/companyBind',
      payload:{
        companyId,
        orderId:this.state.orderId
      },
    })
  };
  removeBindCompany =(companyId)=>{
    this.props.dispatch({
      type:'order/removeCompanyBind',
      payload:{
        companyId,
        orderId:this.state.orderId
      },
    })
  };

  onChange = (e)=>{
    const query = this.state.query;
    this.state.query ={
      ...query,
      page_rows:e.pageSize,
      page_page:e.current,
    };
    this.initCompanyList()
  };
  render(){
    const { loading, order} = this.props;
    const { companyPage ,orderIdByOrderIdList} = order;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: companyPage.rows,
      total: companyPage.totalRows,
      current:companyPage.page
    };
    const columns =[
      {
        title: '序号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '商家/网点名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '地理位置',
        dataIndex: 'cityIdLabel',
        key: 'cityIdLabel',
      },
      {
        title: '具体地址',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '操作',
        render: (text, record) => {
          for(let i in orderIdByOrderIdList){
            if(record.id === orderIdByOrderIdList[i].companyId){
              return (
                <div>
                  <Button  type="danger" onClick={() => this.removeBindCompany(record.id)}>解绑商家</Button>
                </div>
              );
             }
          }
          return (
            <div>
              <Button  type="primary" onClick={() => this.bindCompany(record.id)}>绑定商家</Button>
            </div>
          );
        },
      }
    ];
    return(
      <div>
        <Table dataSource={companyPage.dataList} columns={columns} pagination={paginationProps} loading={loading} rowKey={record => record.id} onChange={this.onChange}/>
      </div>
    )
  }
}
