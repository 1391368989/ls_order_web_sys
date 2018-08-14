import React,{PureComponent} from 'react';
import { Table, Modal } from 'antd';
import { connect } from 'dva';
const confirm = Modal.confirm;
@connect(({ rule }) => ({
  rule
}))
export default class CompanyBind extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      roleId: props.roleId
    };
  }
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
  showConfirm =(doOk)=>{
    confirm({
      title: '你确定要取消当前商家的绑定吗?',
      content: '',
      onOk() {
        doOk()
      },
      onCancel() {
      },
    });
  };
  filter = (newData,data)=>{
    let arr = [];
    console.log(newData);
    console.log(data);
    for(let i in newData){
      let str = newData[i];
      for(let j in data){
        if(str === data[j]){
          str = parseInt(str);
          arr.push(str)
         return arr ;
        }
      }
    }
    return arr
  };
  onSelectChange = (selectedRowKeys) => {
    console.log(selectedRowKeys);
    const { rule } = this.props;
    const { bindCompanyList} = rule;
    if(selectedRowKeys.length<bindCompanyList.length){
      //删除
      let arr = this.filter(selectedRowKeys,bindCompanyList);
      this.showConfirm(()=>{
        const { dispatch } = this.props;
        dispatch({
          type: 'rule/deleteRoleCompanyBind',
          payload:{
            "roleId": this.state.roleId,
            "companyIds": arr
          }
        });
        dispatch({
          type: 'rule/setBindCompanyList',
          payload:{
            bindCompanyList:selectedRowKeys,
          }
        });
      })
    }else{
      const { dispatch } = this.props;
      dispatch({
        type: 'rule/setBindCompanyList',
        payload:{
          bindCompanyList:selectedRowKeys,
        }
      });
    }
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
