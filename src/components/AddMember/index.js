import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Select,
  Cascader
} from 'antd';

import styles from './index.less';
const options = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  isLeaf: false,
}, {
  value: 'jiangsu',
  label: 'Jiangsu',
  isLeaf: false,
}];

const Option = Select.Option;
const FormItem = Form.Item;
@Form.create()
@connect(({ addmember, loading }) => ({
  addmember,
  loading: loading.effects['addmember/fetch'],
  pageLoading: loading.effects['addmember/fetchTags'],
}))

export default class AddMember extends Component {
  state = {
    value: 1,
    modalPowerGroup:'agent',
    city:'请选择',
    options:options,
    visible:true,
    cityId:null,
  };
  constructor(props) {
    super(props);
    const state = this.state;
    const { provinceList,dataSource} = props;
    let newP = this.filter(provinceList);
    this.state = {
      ...state,
      options:newP,
      data: props.dataSource,
    };
  }
  componentDidMount(){
    const data = this.state.data;
    if(data!==null){
    //  const cityIdLabel = data.cityIdLabel.split('/');
      this.props.form.setFieldsValue({
        name:data.name,
        linkman:data.linkman,
        linkphone:data.linkphone,
        address:data.address,
        bankName:data.bankName,
        bankCode:data.bankCode,
        bankAddress:data.bankAddress,
        cityIdLabel:data.cityIdLabel,
        type:data.typelabel
      });
    }else{
      this.setState({
        visible:false,
      })
    }
  }
  filter =(arr)=>{
    for (let i in arr){
      arr[i] ={
        ...arr[i],
        isLeaf: false,
      }
    }
    return arr;
  }
/*  handleChange =(value)=>{
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
  };*/
  handleSubmit =e=>{
    e.preventDefault();
    const { dispatch, form,onInitPagination } = this.props;
    let arr = ['name','linkman','linkphone','address','bankName','bankCode','bankAddress','type'];
    if(this.state.visible){
    }else{
      arr.push('cityIdLabels')
    }
    form.validateFields(arr,(err, values) => {
      if (err) return;
      let type = 'add';
      if(this.state.data!==null){
        type = 'set';
        let cityId = null;
        if(this.state.cityId === null){
          cityId = this.state.data.cityId;
        }else{
          cityId = this.state.cityId;
        }
        if(values.type===1||values.type===2){

        }else{
          values.type = this.state.data.type
        }
        values = {
          ...values,
          id:this.state.data.id,
          cityId,
        };
      }else{
        let cityId = this.state.cityId;
        console.log(this.state);
        values = {
          ...values,
          cityId:cityId,
        };
      }
      delete values.cityIdLabels;
      dispatch({
        type: 'addmember/fetch',
        payload: {
          values,
          type:type,
        },
        callback:()=>{
          onInitPagination();
        }
      });
    });
  };
  handleReset = () => {
    this.props.form.resetFields();
  };
  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
    const len = value.length-1;
    console.log( len)
    this.state.cityId = value[len];

  };
  showCity =()=>{
    this.setState({
      visible:false
    })
  };
  loadData = (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    let type = 'addmember/getCity';
    if(targetOption.deep ===2){
      type = 'addmember/getDistrict'
    }
    targetOption.loading = true;
    const { dispatch } = this.props;
    dispatch({
      type:type ,
      payload:{
        id:targetOption.id
      },
      callback:(res)=>{
        targetOption.loading = false;
        if(targetOption.deep ===1){
          targetOption.children = this.filter(res.data.dataList);
        }else{
          targetOption.children = res.data.dataList;
        }
        this.setState({
          options: [...this.state.options],
        });
      }
    });
  /*  // load options lazily
    setTimeout(() => {

    }, 1000);*/
  };
  render(){
    const { form ,loading,pageLoading,powerGroupList} = this.props;
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
        <Form onSubmit={this.handleSubmit} layout="inline" style={pageLoading?{display:'none'}:{}}>
          <Row>
            <Col offset={2} xs={22} md={18}>
              <FormItem label='代理商/网点名' {...formItemLayout}>
                {getFieldDecorator('name',{
                  rules: [{
                    required: true,
                    message: '请输入网点名称!',
                  }],
                })(<Input placeholder="请输入网点名称"  style={style}/>)}
              </FormItem>
          {/*    <FormItem label='初始密码' {...formItemLayout}>
                {getFieldDecorator('userPass',{
                  rules: [{
                    required: true,
                    message: '请输入初始密码!',
                  }],
                })(<Input placeholder="请输入初始密码" />)}
              </FormItem>*/}
              <FormItem label='负责人' {...formItemLayout}>
                {getFieldDecorator('linkman',{
                  rules: [{
                    required: true,
                    message: '请输入负责人姓名!',
                  }],
                })(<Input placeholder="请输入负责人姓名"  style={style}/>)}
              </FormItem>
              <FormItem label='手机号' {...formItemLayout}>
                {getFieldDecorator('linkphone',{
                  rules: [{
                    required: true,
                    message: '请输入手机号!',
                  }],
                })(<Input placeholder="请输入手机号"  style={style}/>)}
              </FormItem>
              {/*  <FormItem label='所属省份' {...formItemLayout}>
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
                </FormItem>*/}
              <div style={this.state.visible?{display:'none'}:{}}>
                <FormItem label='所属省/市/区' {...formItemLayout}>
                  {getFieldDecorator('cityIdLabels',{
                    rules: [{ type: 'array', required: true, message: '请选择所属省/市/区' }],
                  })(
                    <Cascader
                      options={this.state.options}
                      loadData={this.loadData}
                      onChange={this.onChange}
                      filedNames ={
                        {label: 'name', value: 'id', children: 'children'}
                      }
                      changeOnSelect
                      placeholder='请选择所属省/市/区'
                      style={style}
                    />

                  )}
                </FormItem>
              </div>
              {this.state.visible&&
              <FormItem label='所属省/市/区' {...formItemLayout}>
                {getFieldDecorator('cityIdLabel',{
                  rules: [{
                    required: true,
                    message: '请点击右侧编辑对省市区修改!',
                  }],
                })(<Input placeholder="请点击右侧编辑对省市区修改！"  style={style}/>)}
                <a onClick={this.showCity}>
                  编辑
                </a>
              </FormItem>
              }
                <FormItem label='详细地址' {...formItemLayout}>
                  {getFieldDecorator('address',{
                    rules: [{
                      required: true,
                      message: '请输入详细地址!',
                    }],
                  })(<Input placeholder="请输入详细地址"  style={style}/>)}
                </FormItem>
                <FormItem label='银行' {...formItemLayout}>
                  {getFieldDecorator('bankName',{
                    rules: [{
                      required: true,
                      message: '请输入银行!',
                    }],
                  })(<Input placeholder="请输入银行"  style={style}/>)}
                </FormItem>
                <FormItem label='银行卡号' {...formItemLayout}>
                  {getFieldDecorator('bankCode',{
                    rules: [{
                      required: true,
                      message: '请输入银行卡号!',
                    }],
                  })(<Input placeholder="请输入银行卡号"  style={style}/>)}
                </FormItem>
                <FormItem label='开户行' {...formItemLayout}>
                  {getFieldDecorator('bankAddress',{
                    rules: [{
                      required: true,
                      message: '请输入开户行!',
                    }],
                  })(<Input placeholder="请输入开户行"  style={style}/>)}
                </FormItem>
                <FormItem label='商家类型' {...formItemLayout}>
                  {getFieldDecorator('type',{
                    rules: [{
                      required: true,
                      message: '请选择商家类型!',
                    }],
                  })(
                    <Select placeholder="请选择商家类型"  style={style} >
                      {powerGroupList.map((item,index) =>
                        <Option value={item.orderNo} key={index}>{item.label}</Option>
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

