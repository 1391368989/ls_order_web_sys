import React, { PureComponent,Fragment } from 'react';
import { Icon, Input, Button, message, Card } from 'antd';
import { isRepeat } from '../../utils/utils.js'
import { connect } from 'dva';
import styles from './index.less'
import {routerRedux} from 'dva/router'
import SowingMap from '../../components/Mobile/SowingMap'
import ListView from '../../components/Mobile/ListView'

@connect(({ mobile, loading ,listLoading}) => ({
  mobile,
  loading: loading.effects['mobile/saveUserInfo'],
  listLoading: loading.effects['mobile/pagingOrder'],
}))
export default class UserInfo extends PureComponent{
  state = {
    load:1,
    data:{},
    step:1,
    userOrderList:[],
    orderPage:{
      dataList:[]
    },
    query:{
      page: 1,
      rows: 10,
    },
  };
  componentDidMount() {
    let userInfo = localStorage.getItem('user');
    userInfo = JSON.parse(userInfo);
    if (userInfo){
      const state = this.state;
      this.state = {
        ...state,
        companyId: parseInt(userInfo.companyId),
      };
      this.getOrderList();
      this.getUserOrderList();
    }else{
      this.props.dispatch(routerRedux.push('/phone/info'));
    }
  }
  //获取用户订单
  getUserOrderList=()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'mobile/userOwnedOrder',
      payload:{},
      callback:(res)=>{
        this.setState({
          userOrderList:res.data.dataList
        })
      }
    });
  };
  //获取所有订单
  getOrderList =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'mobile/pagingOrder',
      payload:this.state.query,
      callback:(res)=>{
        this.setState({
          load: 0,
          orderPage:res.data.page
        });

      }
    });
  };
 /* //返回上一页 弃用
  back = () =>{
    this.setState({
      step:1,
      load:1,
      query:{
        "page": 1,
        "rows": 10,
      },
    })
  };*/
  //抢单与取消抢单
  setUserOrder(id,status,childOrderId){
    const {dispatch} = this.props;
    if(status){
      dispatch({
        type: 'mobile/userRemoveChildOrderByOrderId',
        payload:{
          orderId:id
        },
        callback: ()=>{
          this.getUserOrderList();
          delete this.state.data[childOrderId];
        }
      });
    }else{
      dispatch({
        type: 'mobile/insertChildOrder',
        payload:{
          parentOrderId:id
        },
        callback: ()=>{
          this.getUserOrderList();
        }
      });
    }
  };
  //用户备注信息追加
  onChange = (e,childOrderId) =>{
    let obj = this.state.data;
    this.state.data = {
      ...obj,
      [childOrderId]:e.target.value
    };
  };
  //下拉加载
  onScroll =(e) =>{
    const clientHeight = e.target.clientHeight;
    const scrollHeight = e.target.scrollHeight;
    const scrollTop = e.target.scrollTop;
    const {mobile} = this.props;
    const {orderPage} = mobile;
    const load = this.state.load;
    if(orderPage.page<orderPage.totalPage&&load === 0 &&clientHeight + scrollTop+50 >= scrollHeight){
      this.setState({load: 1});
      setTimeout(()=>{
        this.state.query.page++;
        this.getOrderList();
      },1000)
    }
    if(orderPage.page>=orderPage.totalPage){
      this.setState({load: 3});
    }
  };
  //列表内部操作
  renderList =(item)=>{
    const { userOrderList} = this.state;
    if(userOrderList&&userOrderList.length>0){
      for(let i in userOrderList){
        if(userOrderList[i].orderId === item.id){
          const childOrderId = userOrderList[i].childOrderId;
          let obj = this.state.data;
          if(!isRepeat(obj,childOrderId)){
            this.state.data = {
              ...obj,
              [childOrderId]: null,
            }
          }
          return(
            <div key={item.id} className={styles.liBox}>
              <div>订单编号：{item.orderNo}</div>
              <div key={item.id} className={styles.li}>
                <div className={styles.left}>
                  <div>{item.orderName}</div>
                  <div>提示信息：{item.orderRemake}</div>
                </div>
                <div className={styles.right}>
                  <Button onClick={()=> this.setUserOrder(item.id,true,userOrderList[i].childOrderId)}>取消订单</Button>
                </div>
              </div>
              <div style={{marginTop:20}}>
                <Input type="text" placeholder="请输入备注信息" onChange={(e)=>this.onChange(e,userOrderList[i].childOrderId)}/>
              </div>
            </div>
          );
        }
      }
    }
    return(
      <div key={item.id} className={styles.liBox}>
        <div>订单编号：{item.orderNo}</div>
        <div key={item.id} className={styles.li}>
          <div className={styles.left}>
            <div>{item.orderName}</div>
            <div>提示信息：{item.orderRemake}</div>
          </div>
          <div className={styles.right}>
            <Button type="danger" onClick={()=> this.setUserOrder(item.id,false)}>立即抢单</Button>
          </div>
        </div>
      </div>
    );
  };
  //提交订单
  handleSubmit = () => {
    /* console.log(this.state.data);
     return*/
    const {dispatch} = this.props;
    dispatch({
      type: 'mobile/submitData',
      payload:this.state.data,
      callback:()=>{
        dispatch(routerRedux.push('/phone/success'));
      }
    });
  };
  render() {
    const { loading } = this.props;
    const { load ,orderPage } = this.state;
    return(
      <div className={styles.bodyBox}>
        <div className={styles.body} onScroll={e=> this.onScroll(e)}>
          <SowingMap/>
          <div>
            <div style={{textAlign:'center'}} className={styles.title}>订单选择</div>
            <div className={styles.listBox}>
              <ListView
                page={orderPage}
                renderList={this.renderList}
                load={load}
              />
            </div>
          </div>
        </div>
        <div className={styles.footer} >
          {/* <Button size="large" type="primary" className="info-form-button" onClick={()=>this.back()} style={{marginRight:'10%'}}>
            上一步
          </Button>*/}
          <Button size="large" type="primary" onClick={this.handleSubmit} style={{width:'100%',zIndex:'1000'}}>
            提交
          </Button>
        </div>
      </div>
    )
  }
}
