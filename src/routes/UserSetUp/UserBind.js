import React,{PureComponent} from 'react';
import { Table } from 'antd';
import { connect } from 'dva';
@connect(({ rule }) => ({
  rule
}))
export default class UserBind extends PureComponent{
  pagingChange =(value)=>{
    console.log(value.current);
    let query = {
      page_rows:10,
      page_page:value.current,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/pagingUserList',
      payload:query,
    });
  };
  onSelectChange = (selectedRowKeys) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/setBindUserList',
      payload:{
        userBindList:selectedRowKeys,
      }
    });
  };
  render() {
    const { rule } = this.props;
    const {userData, userBindList} = rule;
    const rowSelection = {
      selectedRowKeys:userBindList,
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
          dataSource={userData.dataList}
          columns={column}
          rowSelection={rowSelection}
          pagination={{
            current:userData.page,
            defaultPageSize:userData.rows,
            total:userData.totalRows,
          }}
          onChange={this.pagingChange}
        />
      </div>
    );
  }
}
