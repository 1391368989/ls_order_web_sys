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
    modalPowerGroup:'agent',
    city:'请选择'
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'addmember/fetchTags',
      payload:{
        type: "companytype"
      }
    });
  }
  handleChange =(value)=>{
    this.setState({
        modalPowerGroup:'agent'
      }
    )
  };

  handleChangeProvince =(value) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'addmember/getCity',
      payload:{
        id:value
      }
    });
    this.setState({
        city:null,
      }
    )
  };
  handleChangeCity =(value)=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'addmember/getDistrict',
      payload:{
        id:value
      }
    });
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
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  render(){
    const { form ,addmember,loading} = this.props;
    const { powerGroupList ,provinceList ,cityList, districtList} = addmember;
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
              <FormItem label='代理商/网点名' {...formItemLayout}>
                {getFieldDecorator('name',{
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
                {getFieldDecorator('linkman',{
                  rules: [{
                    required: true,
                    message: '请输入负责人姓名!',
                  }],
                })(<Input placeholder="请输入负责人姓名" />)}
              </FormItem>
              <FormItem label='手机号' {...formItemLayout}>
                {getFieldDecorator('linkphone',{
                  rules: [{
                    required: true,
                    message: '请输入手机号!',
                  }],
                })(<Input placeholder="请输入手机号" />)}
              </FormItem>
              {this.state.modalPowerGroup === 'agent'&&
              <div>
                <FormItem label='所属省份' {...formItemLayout}>
                  {getFieldDecorator('province',{
                    rules: [{
                      required: true,
                      message: '请选择所属省/直辖市!',
                    }],
                  })(
                    <Select placeholder="请选择所属省/直辖市" onChange={this.handleChangeProvince}>
                      {provinceList.map((item,index) =>
                        <Option value={item.id} key={index}>{item.name}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
                <FormItem label='所属城市' {...formItemLayout}>
                  {getFieldDecorator('city',{
                    rules: [{
                      required: true,
                      message: '请输入所属城市!',
                    }],
                  })(
                    <Select placeholder="请选择所属城市" onChange={this.handleChangeCity}>
                      {cityList.map((item,index) =>
                        <Option value={item.id} key={index}>{item.name}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
                <FormItem label='所属区/县' {...formItemLayout}>
                  {getFieldDecorator('cityId',{
                    rules: [{
                      required: true,
                      message: '请选择所属区县!',
                    }],
                  })(
                    <Select placeholder="请选择所属区县">
                      {districtList.map((item,index) =>
                        <Option value={item.id} key={index}>{item.name}</Option>
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
                <FormItem label='银行' {...formItemLayout}>
                  {getFieldDecorator('bankName',{
                    rules: [{
                      required: true,
                      message: '请输入银行!',
                    }],
                  })(<Input placeholder="请输入银行" />)}
                </FormItem>
                <FormItem label='银行卡号' {...formItemLayout}>
                  {getFieldDecorator('bankCode',{
                    rules: [{
                      required: true,
                      message: '请输入银行卡号!',
                    }],
                  })(<Input placeholder="请输入银行卡号" />)}
                </FormItem>
                <FormItem label='开户行' {...formItemLayout}>
                  {getFieldDecorator('bankAddress',{
                    rules: [{
                      required: true,
                      message: '请输入开户行!',
                    }],
                  })(<Input placeholder="请输入开户行" />)}
                </FormItem>
                <FormItem label='商家类型' {...formItemLayout}>
                  {getFieldDecorator('type',{
                    rules: [{
                      required: true,
                      message: '请选择商家类型!',
                    }],
                  })(
                    <Select placeholder="请选择商家类型">
                      {powerGroupList.map((item,index) =>
                        <Option value={item.code} key={index}>{item.label}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
            {/*    <FormItem label='所属运营组' {...formItemLayout}>
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
                </FormItem>*/}
              </div>
              }
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading} >提交</Button>
                <Button style={{ marginLeft: 20 }} onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }

}

