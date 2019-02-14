import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col,Icon } from 'antd';
import omit from 'omit.js';
import styles from './index.less';
import map from './map';
import {host} from '../../utils/utils'

const FormItem = Form.Item;
function generator({ defaultProps, defaultRules, type }) {
  return WrappedComponent => {
    return class BasicComponent extends Component {
      static contextTypes = {
        form: PropTypes.object,
        updateActive: PropTypes.func,
      };

      constructor(props) {
        super(props);
        this.state = {
          count: 0,
          codeQuery:0,
          iconCode:''
        };
      }

      componentDidMount() {
        const { updateActive } = this.context;
        const { name } = this.props;
        if (updateActive) {
          updateActive(name);
        }
        this.onGetImgCode()
      }

      componentWillUnmount() {
        clearInterval(this.interval);
      }
      onGetCaptcha = () => {
        let count = 59;
        this.setState({ count });
        const { onGetCaptcha } = this.props;
        if (onGetCaptcha) {
          onGetCaptcha();
        }
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      };
      onGetImgCode = () =>{
      /*  const { onGetImgCode } = this.props;
        if (onGetImgCode) {
          onGetImgCode();
        }*/
        /* obj.src = host + "/sys/getVerify?"+Math.random();
         this.state.codeQuery = ++this.state.codeQuery;*/
        this.setState({
          iconCode:host+'/getVerify?a='+Math.random()
        })
      };
      render() {
        const { form } = this.context;
        const { getFieldDecorator } = form;
        const options = {};
        let otherProps = {};
        const { onChange, defaultValue, rules ,imgSrc, name, ...restProps } = this.props;
        const { count } = this.state;
        options.rules = rules || defaultRules;
        if (onChange) {
          options.onChange = onChange;
        }
        if (defaultValue) {
          options.initialValue = defaultValue;
        }
        otherProps = restProps || otherProps;
        if (type === 'Captcha') {
          const inputProps = omit(otherProps, ['onGetCaptcha']);
          return (
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator(name, options)(
                    <WrappedComponent {...defaultProps} {...inputProps} />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    disabled={count}
                    className={styles.getCaptcha}
                    size="large"
                    onClick={this.onGetCaptcha}
                  >
                    {count ? `${count} s` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </FormItem>
          );
        }
        if (type === 'Code') {
          const inputProps = omit(otherProps, ['onGetImgCode']);
          return (
            <FormItem>
              <Row gutter={8}>
                <Col span={10}>
                  {getFieldDecorator(name, options)(
                    <WrappedComponent {...defaultProps} {...inputProps} />
                  )}
                </Col>
                <Col span={14}>
                  <img src={this.state.iconCode} height={40} onClick={this.onGetImgCode} style={{verticalAlign:'top'}}/>
                  <span style={{fontSize:14,marginLeft:10,cursor:'pointer'}} onClick={this.onGetImgCode}>
                    <Icon type="reload"/>
                  </span>
                </Col>
              </Row>
            </FormItem>
          );
        }
        return (
          <FormItem>
            {getFieldDecorator(name, options)(
              <WrappedComponent {...defaultProps} {...otherProps} />
            )}
          </FormItem>
        );
      }
    };
  };
}

const LoginItem = {};
Object.keys(map).forEach(item => {
  LoginItem[item] = generator({
    defaultProps: map[item].props,
    defaultRules: map[item].rules,
    type: item,
  })(map[item].component);
});

export default LoginItem;
