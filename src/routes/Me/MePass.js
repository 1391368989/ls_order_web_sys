import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { connect } from 'dva';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Table,
  Tree
} from 'antd';

import styles from './MePass.less';
const FormItem = Form.Item;
@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.models.workplace,
}))

export default class MePass extends Component {

  handleSearch(e){
    console.log(e)
  }
  render() {
    const { form } = this.props;
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
    return (
      <PageHeaderLayout title="密码设置">
        <Card>
          <div className={styles.tableListForm}>
            <Form onSubmit={this.handleSearch} layout="inline">
              <Row gutter={24}>
                <Col xs={10} offset={2}>
                  <FormItem {...formItemLayout} label="初始密码">
                    {getFieldDecorator('pass',{
                      rules: [{
                        required: true,
                        message: '请输入初始密码!',
                      }],
                    })(<Input placeholder="请输入初始密码" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={10} offset={2}>
                  <FormItem {...formItemLayout} label="新密码">
                    {getFieldDecorator('newPass',{
                      rules: [{
                        required: true,
                        message: '请输入新密码!',
                      }],
                    })(<Input placeholder="请输入新密码" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={10} offset={2}>
                  <FormItem {...formItemLayout} label="重复新密码">
                    {getFieldDecorator('towPass',{
                      rules: [{
                        required: true,
                        message: '请再次输入新密码!',
                      }],
                    })(<Input placeholder="请再次输入新密码" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={24}>
                <Col xs={10} offset={2}>
                  <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">提交</Button>
                  </FormItem>
                </Col>
              </Row>

            </Form>
          </div>
        </Card>
      </PageHeaderLayout>
    )
  }
}


