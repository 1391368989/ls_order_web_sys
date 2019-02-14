import React, { PureComponent,Fragment } from 'react';
import { Form, Icon, Input, Button, message, Card } from 'antd';
import { getQuery, isRepeat, mobilePattern, idPattern } from '../../utils/utils.js'
import { connect } from 'dva';
import styles from './index.less'
import {routerRedux} from 'dva/router'
import SowingMap from '../../components/Mobile/SowingMap'
import ListView from '../../components/Mobile/ListView'
import Result from '../../components/Result';
const FormItem = Form.Item;
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
    let companyId = -1;
    if(query&&query.companyId !== undefined){
      companyId = query.companyId
    }
    this.state = {
      ...state,
      companyId: parseInt(companyId),
      query:{
        page: 1,
        rows: 10,
      },
    };
  }

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
  next = ()=>{
    this.props.form.validateFields(['userName','userPhone','userIdCode'],(err,values) => {
      if (!err) {
        const {dispatch} = this.props;
        let payload = {
          ...values,
          companyId:this.state.companyId
        };
        dispatch({
          type: 'mobile/saveUserInfo',
          payload:payload,
          callback: ()=>{
          /*  this.setState({
              step:2
            });*/
            payload = JSON.stringify(payload);
            localStorage.setItem('user',payload);
            dispatch(routerRedux.push('/phone/list'));
          /*  this.getOrderList();
            this.getUserOrderList();*/
          }
        });
      }
    });
  };
  /* getUserOrderList=()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'mobile/userOwnedOrder',
      payload:{}
    });
  };*/

/*  getOrderList =()=>{
    const {dispatch} = this.props;
    dispatch({
      type: 'mobile/pagingOrder',
      payload:this.state.query,
      callback:()=>{
        this.setState({load: 0});
      }
    });
  };*/
  back = () =>{
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
        <div key={item.id} className={styles.li}>
        <div className={styles.left}>
          <div>{item.orderName}</div>
          <div>订单编号：{item.orderNo}</div>
          <div>提示信息：{item.orderRemake}</div>
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
    const extra = (
      <Fragment>
        <div>
          <span>未获取到网点信息，请重新扫码！</span>
        </div>
      </Fragment>
    );
    return(
      <div>
        <div>
          <div className={styles.body} onScroll={e=> this.onScroll(e)}>
            <div>
              <SowingMap/>
            </div>
            {this.state.companyId <0 &&
            <Card bordered={false} >
              <Result
                type="error"
                title="扫码失败"
                description="未获取到网点信息，请重新扫码。"
                style={{ marginTop: 48, marginBottom: 16 }}
              />
            </Card>
            }
            {this.state.companyId >= 0&&
            <div>
              <div style={{textAlign:'center'}} className={styles.title}>基本信息</div>
              <div>
                <Form>
                  <div style={step === 1?{}:{display:'none'}} className={styles.box}>
                    <FormItem>
                      {getFieldDecorator('userName', {
                        rules: [
                          { required: true, message: '请输入姓名！' },
                          { max: 10, message: '姓名长度不能超过10个字符！' },
                        ],
                      })(
                        <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="姓名" />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('userPhone', {
                        rules: [
                          { required: true, message: '请输入手机号!' },
                          { pattern: mobilePattern, message: '手机号格式不对' },
                        ],
                      })(
                        <Input size="large" prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} type="number" placeholder="手机号" />
                      )}
                    </FormItem>
                    <FormItem>
                      {getFieldDecorator('userIdCode', {
                        rules: [
                          { required: true, message: '请输入身份证号!' },
                          { pattern: idPattern, message: '输入的身份证号不合法!' }
                        ],
                      })(
                        <Input size="large" prefix={<Icon type="idcard" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="身份证号" />
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
              <div className={styles.footer} style={step === 2?{}:{display:'none'}}>
                {/* <Button size="large" type="primary" className="info-form-button" onClick={()=>this.back()} style={{marginRight:'10%'}}>
            上一步
          </Button>*/}
                <Button size="large" type="primary" onClick={this.handleSubmit} style={{width:'100%'}}>
                  提交
                </Button>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
