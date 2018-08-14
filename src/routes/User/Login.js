import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Modal, Input ,Row ,Col, Icon } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import test from '../../assets/images/banner1.jpg'
/*import Row from "antd/lib/grid/row.d";*/

const { UserName, Password, Code, Submit } = Login;
const InputGroup = Input.Group;
@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    query:0,
  };
  componentDidMount() {
    this.getImgCode();
  }
  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { dispatch } = this.props;
    if (!err) {
      dispatch({
        type: 'login/login',
        payload: {
          ...values
        },
      });
    }
  };
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };
  info =()=>{
    Modal.warning({
      title: '忘记密码',
      content: (
        <div>
          <p>请联系管理员！</p>
        </div>
      )
    });
  };
  getImgCode =()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'login/getImg',
      payload:{
        a:++this.state.query
      }
    });
  };
  render() {
    const { login, submitting } = this.props;
    const {codeImg} = login;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          {login.status === -1 &&
          !submitting &&
          this.renderMessage(login.type)}
          <UserName name="userPhone" placeholder="请输入用户名/手机号" />
          <Password name="password" placeholder="请输入密码" />
          <Code name="securityCode" placeholder="请输入验证码" onGetImgCode={() => this.getImgCode()} imgSrc={codeImg}/>
      {/*    <Tab key="mobile" tab="手机号登录">
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage('验证码错误')}
            <Mobile name="mobile" />
            <Captcha name="captcha" />
          </Tab>*/}
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="javascript:;"  onClick={this.info}>
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
       {/*   <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>*/}
        </Login>
      </div>
    );
  }
}
