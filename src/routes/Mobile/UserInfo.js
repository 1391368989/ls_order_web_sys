import React, { PureComponent } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { getQuery, isRepeat } from '../../utils/utils.js'
import { connect } from 'dva';
import styles from './index.less'
import {routerRedux} from 'dva/router'
import SowingMap from '../../components/Mobile/SowingMap'
import ListView from '../../components/Mobile/ListView'
const FormItem = Form.Item;
function  getArr() {
  let arr = [];
  for (let  i = 0;i < 60; i++){
    arr.push(i);
  }
  return arr;
}
const arr = getArr();
@Form.create()
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
  };
  constructor(props) {
    super(props);
    const search = props.location.search;
    const query = getQuery(search);
    const state = this.state;
    this.state = {
      ...state,
      companyId:query.companyId,
      query:{
        "page": 1,
        "rows": 10,
      },
    };
  }
  getUserOrderList=()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'mobile/userOwnedOrder',
      payload:{}
    });
  };
  handleSubmit = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'mobile/submitData',
      payload:this.state.data,
      callback:()=>{
        dispatch(routerRedux.push('/phone/success'));
      }
    });
  };
  next = ()=>{
    this.props.form.validateFields(['userName','userPhone','userIdCode'],(err,values) => {
      if (!err) {
        const {dispatch} = this.props;
        dispatch({
          type: 'mobile/saveUserInfo',
          payload:{
            ...values,
            companyId:this.state.companyId
          },
          callback: ()=>{
            this.getOrderList();
            this.getUserOrderList();
            this.setState({
              step:2
            })
          }
        });
      }
    });
  };
  getOrderList =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'mobile/pagingOrder',
      payload:this.state.query,
      callback:()=>{
        this.setState({load: 0});
      }
    });
  };
  back = () =>{
    console.log('back');
    this.setState({
      step:1,
      load:1,
      query:{
        "page": 1,
        "rows": 10,
      },
    })
  };
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
  onChange = (e,childOrderId) =>{
    let obj = this.state.data;
    this.state.data = {
      ...obj,
      [childOrderId]:e.target.value
    };
  };
  renderList =(item)=>{
    const { mobile } = this.props;
    const { userOrderList } = mobile;
    if(userOrderList&&userOrderList.length>0){
      for(let i in userOrderList){

        if(userOrderList[i].orderId === item.id){
          const childOrderId = userOrderList[i].childOrderId;
          let obj = this.state.data;
          if(isRepeat(obj,childOrderId)){
            this.state.data = {
              ...obj,
              [childOrderId]: null,
            }
          }
          return(
            <div key={item.id} className={styles.liBox}>
              <div key={item.id} className={styles.li}>
                <div className={styles.left}>
                  <div>{item.orderName}</div>
                  <div>订单编号：{item.orderNo}</div>
                  <div>商户来源：{item.orderPromulgator}</div>
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
        <div key={item.id} className={styles.li}>
        <div className={styles.left}>
          <div>{item.orderName}</div>
          <div>订单编号：{item.orderNo}</div>
          <div>商户来源：{item.orderPromulgator}</div>
        </div>
        <div className={styles.right}>
          <Button type="danger" onClick={()=> this.setUserOrder(item.id,false)}>立即抢单</Button>
        </div>
      </div>
    </div>
    );
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { mobile ,loading, } = this.props;
    const { load ,step } = this.state;
    const { orderPage} = mobile;
    return(
      <div>
        <div className={styles.body} onScroll={e=> this.onScroll(e)}>
          <div>
            <SowingMap/>
          </div>
          <div style={{textAlign:'center'}}>{step === 1 ? '基本信息' : '订单选择'}</div>
          <div>
            <Form>
              <div style={step === 1?{}:{display:'none'}} className={styles.box}>
                <FormItem>
                  {getFieldDecorator('userName', {
                    rules: [{ required: true, message: '请输入姓名！' }],
                  })(
                    <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="姓名" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('userPhone', {
                    rules: [{ required: true, message: '请输入手机号!' }],
                  })(
                    <Input size="large" prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} type="number" placeholder="手机号" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('userIdCode', {
                    rules: [{ required: true, message: '请输入身份证号!' }],
                  })(
                    <Input size="large" prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />} type="number" placeholder="身份证号" />
                  )}
                </FormItem>
                <Button size="large" type="primary" className="login-form-button" onClick={()=>this.next()} loading={loading}>
                  下一步
                </Button>
              </div>
            </Form>
            <div style={step === 2?{}:{display:'none'}} className={styles.listBox}>
              {step === 2 &&
              <ListView
                page={orderPage}
                renderList={this.renderList}
                load={load}
              />
              }
            </div>
          </div>
        </div>
        <div className={styles.footer} style={step === 2?{}:{display:'none'}}>
         {/* <Button size="large" type="primary" className="info-form-button" onClick={()=>this.back()} style={{marginRight:'10%'}}>
            上一步
          </Button>*/}
          <Button size="large" type="primary" onClick={this.handleSubmit} style={{width:'100%'}}>
            提交
          </Button>
        </div>
      </div>
    )
  }
}
