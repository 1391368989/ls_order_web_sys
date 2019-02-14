import React, { Component } from 'react';
import { connect } from 'dva';
import  moment  from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  DatePicker
} from 'antd';
import styles from './index.less';

const orderTypeList=[
  {value:1,title:'不限'},
  {value:2,title:'有限'},
];
const Option = Select.Option;
const FormItem = Form.Item;
@Form.create()
@connect(({ order, loading }) => ({
  order,
  loading: loading.effects['order/fetchAdd'],
}))
export default class AddOrder extends Component {
  state ={
  };
  constructor(props) {
    super(props);
    const state = this.state;
    const {data} = props;
    this.state = {
      ...state,
      data: data,
    };
  }
  componentDidMount(){
    const data = this.state.data;
    if(data!==null){
      //  const cityIdLabel = data.cityIdLabel.split('/');
      this.props.form.setFieldsValue({
        orderPromulgator:data.orderPromulgator,
        orderName:data.orderName,
        orderPrice:data.orderPrice,
        orderAllNum:data.orderAllNum,
        orderAgencyPrice:data.orderAgencyPrice,
        orderType:data.orderType,
        orderEffcientDate:moment(data.orderCreateDateLabel,'YYYY-MM-DD HH-mm-ss'),
        cityIdLabel:data.cityIdLabel,
        orderRemake:data.orderRemake
      });
    }
  }
  handleReset =()=>{
    this.props.form.resetFields();
  };

  handleSubmit =(e)=>{
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if(this.props.data!==null){
        values ={
          ...values,
          id:this.props.data.id
        }
      }
      dispatch({
        type: 'order/fetchAdd',
        payload: values
      });
    });
  };
  render(){
    const { form, loading } = this.props;
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
    const style = {
      width: '80%', marginRight: 8
    };
    return(
      <div className={styles.tableListForm}>
        <Form onSubmit={this.handleSubmit} layout="inline" >
          <Row>
            <Col offset={2} xs={22} md={18}>
              <FormItem label='商户' {...formItemLayout}>
                {getFieldDecorator('orderPromulgator',{
                  rules: [{
                    required: true,
                    message: '请输入商户名称!',
                  }],
                })(<Input placeholder="请输入商户名称"  style={style}/>)}
              </FormItem>
              <FormItem label='订单名称' {...formItemLayout}>
                {getFieldDecorator('orderName',{
                  rules: [{
                    required: true,
                    message: '请输入订单名称!',
                  }],
                })(<Input placeholder="请输入订单名称"  style={style}/>)}
              </FormItem>
              <FormItem label='商家单笔价格' {...formItemLayout}>
                {getFieldDecorator('orderPrice',{
                  rules: [{
                    required: true,
                    message: '请输入商家单笔价格!',
                  }],
                })(<Input placeholder="请输入商家单笔价格"  style={style}/>)}
              </FormItem>
              <FormItem label='商家放单量' {...formItemLayout}>
                {getFieldDecorator('orderAllNum',{
                  rules: [{
                    required: true,
                    message: '请输入商家放单量!',
                  }],
                })(<Input placeholder="请输入商家放单量"  style={style}/>)}
              </FormItem>
              <FormItem label='代理商单笔价格' {...formItemLayout}>
                {getFieldDecorator('orderAgencyPrice',{
                  rules: [{
                    required: true,
                    message: '请输入代理商单笔价格!',
                  }],
                })(<Input placeholder="请输入代理商单笔价格"  style={style}/>)}
              </FormItem>
              <FormItem label='所属代理商' {...formItemLayout}>
                {getFieldDecorator('orderType',{
                  rules: [{
                    required: true,
                    message: '请选择所属代理商!',
                  }],
                })(
                  <Select placeholder="请选择所属代理商"  style={style} >
                    {orderTypeList.map((item,index) =>
                      <Option value={item.value} key={index}>{item.title}</Option>
                    )}
                  </Select>
                )}
              </FormItem>
              <FormItem label='生效时间' {...formItemLayout}>
                {getFieldDecorator('orderEffcientDate',{
                  rules: [{
                    required: true,
                    message: '请输入生效时间!',
                  }],
                })(
                  <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请输入生效时间"
                />
                )}
              </FormItem>
              <FormItem label='备注' {...formItemLayout}>
                {getFieldDecorator('orderRemake')(<Input placeholder="请输入备注"  style={style}/>)}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={loading}>提交</Button>
                <Button style={{ marginLeft: 20 }} onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
