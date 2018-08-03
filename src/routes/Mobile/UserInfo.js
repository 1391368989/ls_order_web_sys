import React, { PureComponent } from 'react';
import { Form, Icon, Input, Button ,Radio } from 'antd';
import { connect } from 'dva';
import styles from './index.less'
import {routerRedux} from 'dva/router'
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
@Form.create()
@connect()
export default class UserInfo extends PureComponent{
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        let dispatch = this.props.dispatch;
        dispatch(routerRedux.push(`/phone/Success`));
      }
    });
  };
  next = ()=>{
    console.log('下一步')
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <div style={{textAlign:'center'}}>基本信息</div>
        <div className={styles.box}>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('userNameInfo', {
                rules: [{ required: true, message: '请输入姓名！' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="姓名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('userPhoneInfo', {
                rules: [{ required: true, message: '请输入手机号!' }],
              })(
                <Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} type="number" placeholder="手机号" />
              )}
            </FormItem>
            <Button type="primary" className="login-form-button" onClick={()=>this.next()}>
              下一步
            </Button>
            <FormItem>
              {getFieldDecorator('radio-group',
                {
                  rules: [{ required: true, message: '请选择订单!' }],
                }
              )(
                <RadioGroup>
                  <Radio className={styles.radioStyle} value="a">中国建设银行</Radio>
                  <Radio className={styles.radioStyle} value="b">广东发展银行</Radio>
                  <Radio className={styles.radioStyle} value="c">中国工商银行</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" className="info-form-button" onClick={()=>this.next()} style={{marginRight:'10%'}}>
                上一步
              </Button>
              <Button type="primary" htmlType="submit" className="info-form-button">
                提交
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
