import React,{Component} from 'react';
import { Form ,Input,Button } from 'antd'
import { connect } from 'dva';


const FormItem = Form.Item;

@Form.create()
@connect(({ workplace, loading }) => ({
  workplace,
  loading: loading.effects['workplace/insertDrawings'],
}))
export default class InsertDrawings extends Component{
  handleSearch=(e)=>{
    e.preventDefault();
    const { dispatch, form ,companyId,onChange} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type:'workplace/insertDrawings',
        payload:{
          ...values,
          drawCompanyId:companyId
        },
        callback:()=>{
          onChange();
        }
      })
    })
  };
  render(){
    const { form ,loading} = this.props;
    const { getFieldDecorator } = form;
    return(
      <Form onSubmit={this.handleSearch} layout="inline">
        <div>
          <FormItem label="备注">
            {getFieldDecorator('drawName',{
              rules: [{
                required: true,
                message: '请填写提现备注!',
              }],
            })
            (<Input placeholder="请填写提现备注"  />)}
          </FormItem>
        </div>
        <div style={{marginTop:20}}>
          <FormItem label="金额">
            {getFieldDecorator('drawPrice',{
              rules: [{
                required: true,
                message: '请填写提现金额!',
              }],
            })
            (<Input placeholder="请填写提现金额"  />)}
          </FormItem>
        </div>
        <div style={{marginTop:20}}>
          <Button loading={loading} type="primary" htmlType="submit">提交</Button>
        </div>
      </Form>
    )
  }
}
{/* */}
