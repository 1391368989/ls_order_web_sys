import React,{PureComponent} from 'react';
import { Transfer, Pagination } from 'antd';
import { connect } from 'dva';
const mockData = [];
for (let i = 0; i < 20; i++) {
  mockData.push({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
  });
}

const targetKeys = mockData
  .filter(item => +item.key % 3 > 1)
  .map(item => item.key);
@connect(({ rule }) => ({
  rule
}))
export default class MyTransfer extends PureComponent{
  state = {
    targetKeys,
    selectedKeys: [],
  };

  handleChange = (nextTargetKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
    console.log(nextTargetKeys);
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/setBindCompanyList',
      payload:{
        nextTargetKeys:nextTargetKeys,
      }
    });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/setSelectBindCompanyList',
      payload:{
        sourceSelectedKeys:sourceSelectedKeys,
        targetSelectedKeys:targetSelectedKeys
      }
    });
  };

  /*handleScroll = (direction, e) => {
  const  clientHeight = e.target.clientHeight;
  const  scrollHeight = e.target.scrollHeight;
  const  scrollTop = e.target.scrollTop;
    if(clientHeight + scrollTop >= scrollHeight-50){
      console.log('加载')
    }
  };*/
  pagingChange =(pageNumber)=>{
    console.log(pageNumber);
    let selectCompany = {
      page_rows:10,
      page_page:pageNumber,
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/pagingCompany',
      payload:{
        selectCompany:selectCompany,
      }
    });
  };
  render() {
    const state = this.state;
    const { rule } = this.props;
    const {companyData, bindCompanyList,companySelectedKeys} = rule;
    return (
      <div>
        <Transfer
          dataSource={companyData.dataList}
          titles={['所有商家', '组内成员']}
          targetKeys={bindCompanyList}
          selectedKeys={companySelectedKeys}
          onChange={this.handleChange}
          onSelectChange={this.handleSelectChange}
          render={item => item.title}
          showSearch={true}
          listStyle={{
            width: 210,
            height: 400,
          }}
        />
        <Pagination
          defaultCurrent = {companyData.page}
          pageSize={companyData.rows}
          total={companyData.totalRows}
          style={{marginTop:20}}
          onChange={this.pagingChange}/>
      </div>
    );
  }
}
