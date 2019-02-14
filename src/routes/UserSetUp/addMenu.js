import React,{ Component } from 'react';
import { Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete } from 'antd';

const FormItem = Form.Item;
@Form.create()
export default class AddMenu extends Component{
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
      }
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
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
    return(
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            {...formItemLayout}
            label="image/图标"
          >
            {getFieldDecorator('image')(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="name/标题（极简描述）"
          >
            {getFieldDecorator('email', {
              rules: [ {
                required: true, message: '请输入标题!',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="path/路径）"
          >
            {getFieldDecorator('email', {
              rules: [ {
                required: true, message: '请输入路径!',
              }],
            })(
              <Input />
            )}
          </FormItem>
        </Form>
      </div>
    )
  }
}
