import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select
} from 'antd';
import styles from './index.less';

const Option = Select.Option;
const FormItem = Form.Item;
@Form.create()
@connect(({ addmember, loading }) => ({
  addmember,
  loading: loading.effects['addmember/fetch'],
}))

export default class AddMember extends Component {
  state = {
    value: 1,
    modalPowerGroup:''
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addmember/fetchTags',
    });
  }
  handleChange =(value)=>{
    this.setState({
        modalPowerGroup:value
      }
    )
  };
  handleSubmit =e=>{
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'addmember/fetch',
        payload: values,
      });
    });
  }
  render(){
    const { form ,addmember,loading} = this.props;
    const { powerGroupList} = addmember;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return(
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSubmit} layout="inline">
          <Row>
            <Col offset={2} md={12}>
              <FormItem label='权限组' {...formItemLayout}>
                {getFieldDecorator('powerGroup',{
                  rules: [{
                    required: true,
                    message: '请选择权限组！',
                  }],
                })(
                  <Select placeholder="请选择权限组" onChange={this.handleChange}>
                    {powerGroupList.map((item,index) =>
                      <Option value={item.value} key={index}>{item.name}</Option>
                    )}
                  </Select>
                )}
              </FormItem>
              <FormItem label='账户名' {...formItemLayout}>
                {getFieldDecorator('userName',{
                  rules: [{
                    required: true,
                    message: '请输入账户名!',
                  }],
                })(<Input placeholder="请账户名" />)}
              </FormItem>
              <FormItem label='初始密码' {...formItemLayout}>
                {getFieldDecorator('userPass',{
                  rules: [{
                    required: true,
                    message: '请输入初始密码!',
                  }],
                })(<Input placeholder="请输入初始密码" />)}
              </FormItem>
              <FormItem label='负责人' {...formItemLayout}>
                {getFieldDecorator('principal',{
                  rules: [{
                    required: true,
                    message: '请输入负责人姓名!',
                  }],
                })(<Input placeholder="请输入负责人姓名" />)}
              </FormItem>
              <FormItem label='手机号' {...formItemLayout}>
                {getFieldDecorator('phone',{
                  rules: [{
                    required: true,
                    message: '请输入手机号!',
                  }],
                })(<Input placeholder="请输入手机号" />)}
              </FormItem>
              {this.state.modalPowerGroup=='agent'&&
              <div>
                <FormItem label='所属城市' {...formItemLayout}>
                  {getFieldDecorator('city',{
                    rules: [{
                      required: true,
                      message: '请输入所属城市!',
                    }],
                  })(
                    <Select placeholder="请输入所属城市">
                      {powerGroupList.map((item,index) =>
                        <Option value={item.value} key={index}>{item.name}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
                <FormItem label='详细地址' {...formItemLayout}>
                  {getFieldDecorator('address',{
                    rules: [{
                      required: true,
                      message: '请输入详细地址!',
                    }],
                  })(<Input placeholder="请输入详细地址" />)}
                </FormItem>
                <FormItem label='开户行' {...formItemLayout}>
                  {getFieldDecorator('openingBank',{
                    rules: [{
                      required: true,
                      message: '请输入开户行!',
                    }],
                  })(<Input placeholder="请输入开户行" />)}
                </FormItem>
                <FormItem label='银行卡号' {...formItemLayout}>
                  {getFieldDecorator('openingBank',{
                    rules: [{
                      required: true,
                      message: '请输入银行卡号!',
                    }],
                  })(<Input placeholder="请输入银行卡号" />)}
                </FormItem>
                <FormItem label='所属运营组' {...formItemLayout}>
                  {getFieldDecorator('belongOperationsGroup',{
                    rules: [{
                      required: true,
                      message: '请选择所属运营组!',
                    }],
                  })(
                    <Select placeholder="请选择所属运营组">
                      {powerGroupList.map((item,index) =>
                        <Option value={item.value} key={index}>{item.name}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </div>
              }
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading} >提交</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

}

