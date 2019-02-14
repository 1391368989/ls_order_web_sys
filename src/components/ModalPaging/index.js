import React,{Component} from 'react'
import {Table, Button} from 'antd'
import { connect } from 'dva';

@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.effects['workplace/init'],
}))
export default class ModalPaging extends Component{
  constructor(props) {
    super(props);
    const state = this.state;
    this.state = {
      ...state,
      query:{
        page_rows:10,
        page_page:1,
      }
    };
  };
  componentDidMount(){
    this.initCompanyList();
  }
  initCompanyList(){
    const {dispatch} = this.props;
    dispatch({
      type:'workplace/init',
      payload:{
        pageVO: this.state.query,
        path: '/order/order/selectChildOrderAgencyPrice'
      }
    })
  }
  onChange = (e)=>{
    const query = this.state.query;
    this.state.query ={
      ...query,
      rows:e.pageSize,
      page:e.current,
    };
    this.initCompanyList()
  };
  onSelectChange=(id,item)=>{
    this.props.onChange(item[0]);
  };
  render(){
    const { loading, workplace} = this.props;
    const { companyPage } = workplace;
    const rowSelection = {
      onChange: this.onSelectChange,
      type:'radio',
      hideDefaultSelections: true
    };
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
        title: '负责人',
        dataIndex: 'linkman',
        key: 'linkman',
      },
      {
        title: '具体地址',
        dataIndex: 'address',
        key: 'address',
      }
    ];
    return(
      <div>
        <Table
          rowSelection={rowSelection}
          dataSource={companyPage.dataList} columns={columns} pagination={paginationProps} loading={loading} rowKey={record => record.id} onChange={this.onChange}/>
      </div>
    )
  }
}
