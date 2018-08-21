import React,{PureComponent} from 'react';
import { Table, Modal } from 'antd';
import { connect } from 'dva';
const confirm = Modal.confirm;
@connect(({ rule }) => ({
  rule
}))
export default class CompanyBind extends PureComponent{
  pagingChange =(value)=>{
    let selectCompany = {
      page_rows:10,
      page_page:value.current,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/pagingCompany',
      payload:{
        selectCompany:selectCompany,
      }
    });
  };
  onSelectChange = (selectedRowKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/setBindCompanyList',
      payload:{
        bindCompanyList:selectedRowKeys,
      }
    });
  };
  render() {
    const { rule } = this.props;
    const {companyData, bindCompanyList} = rule;
    const rowSelection = {
      selectedRowKeys:bindCompanyList,
      onChange: this.onSelectChange,
    };
    const column = [{
      title: '序号',
      dataIndex: 'key',
      key: 'key',
    }, {
      title: '商家名称',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    }];
    return (
      <div>
        <Table
          dataSource={companyData.dataList}
          columns={column}
          rowSelection={rowSelection}
          pagination={{
            current:companyData.page,
            defaultPageSize:companyData.rows,
            total:companyData.totalRows,
          }}
          onChange={this.pagingChange}
        />
      </div>
    );
  }
}
