import React from 'react';
import { Input, Icon } from 'antd';
import styles from './index.less';

const map = {
  UserName: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="user" className={styles.prefixIcon} />,
      placeholder: 'admin',
    },
    rules: [
      {
        required: true,
        message: '请输入用户名!',
      },
      {
        max:20,
        message:'格式不对'
      }
    ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '888888',
    },
    rules: [
      {
        required: true,
        message: '请输入密码!',
      },
      {
        max:20,
        message:'格式不对'
      }
    ],
  },
  Mobile: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: 'mobile number',
    },
    rules: [
      {
        required: true,
        message: 'Please enter mobile number!',
      },
      {
        pattern: /^1\d{10}$/,
        message: 'Wrong mobile number format!',
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: 'captcha',
    },
    rules: [
      {
        required: true,
        message: 'Please enter Captcha!',
      },
    ],
  },
  Code: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="code-o" className={styles.prefixIcon} />,
      placeholder: 'code',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码',
      },
      {
        pattern: /^\d{4}$/,
        message: '验证码格式不对',
      },
    ],
  },

};

export default map;
