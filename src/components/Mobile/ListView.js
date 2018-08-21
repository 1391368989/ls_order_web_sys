import React, { Component } from 'react';
import {Icon} from 'antd'
export default class ListView extends Component {

  constructor(props) {
    super(props);
    const page = props.page;
    const load = props.load;
    this.state = {
      page,
      load,
    }
  };
  componentWillReceiveProps() {
    let newPage = this.props.page;
    let page = this.state.page;
    if(newPage.page ===1 ){
      page = newPage
    }else if(page.page !==newPage.page){
      if(newPage.page>1) {
        page.dataList = [
          ...page.dataList,
          ...newPage.dataList
        ];
        page.page = newPage.page
      }
    }
    this.setState({
      page
    })
  };
  render(){
    const { renderList} = this.props;
    const { load} = this.props;
    return(
      <div>
        <div>
          {this.state.page.dataList.length>=1&&(this.state.page.dataList).map((item)=>(
              renderList(item)
            )
          )}
        </div>
        {load === 1 &&
        <div style={{textAlign: 'center', padding: 20}}>
          <Icon type="loading"/>
          <div>加载中</div>
        </div>
        }
        {load === 3 &&
        <div style={{textAlign: 'center', padding: 20}}>
          <div>没有更多订单了</div>
        </div>
        }
      </div>
    )
  }
}

