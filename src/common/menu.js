import { isUrl } from '../utils/utils';
import power from '../utils/power';
const menuData = [
  //'analysis/order-analysis',
  {
    name: '仪表盘',
    icon: 'dashboard',
    path: 'dashboard',
    authority: power.dashboard,
    children: [
      {
        name: '工作台',
        path: 'workplace',
      },
      {
        name: '盈亏分析',
        path: 'analysis',
        authority: power.analysis,
      },
      {
        name: '客单分析',
        path: 'order-analysis',
      }
    ],
  },
  {
    name: '代理商管理',
    icon: 'laptop',
    path: 'agent',
    authority: power.agent,
    children: [
      {
        name: '代理商信息',
        path: 'agent-info',
      }
    ],
  },
  {
    name: '订单管理',
    icon: 'form',
    path: 'order',
    children: [
      {
        name: '订单情况',
        path: 'order-info',
      },
      {
        name: '待核实订单',
        path: 'to-be-verified',
      },
      {
        name: '已核实订单',
        path: 'verified-order',
      },
      {
        name: '商户核算订单',
        path: 'business-accounting-order',
      }
    ],
  },
  {
    name: '财务管理',
    icon: 'pay-circle-o',
    path: 'finance',
    children: [
      {
        name: '代理商提现',
        path: 'agent-put-forward',
      },
      {
        name: '商户到帐审核',
        path: 'merchant-examines',
      },
      {
        name: '报销信息',
        path: 'reimbursement-information',
      },
      {
        name: '我的财务',
        path: 'agent-fiance',
      }
    ],
  },
  {
    name: '用户设置',
    icon: 'team',
    path: 'user-set-up',
    children: [
      {
        name: '用户管理',
        path: 'user-management',
      },
      {
        name: '权限管理',
        path: 'power-management',
      }
    ],
  },
  {
    name: '个人中心',
    icon: 'setting',
    path: 'me',
    children: [
      {
        name: '密码管理',
        path: 'me-pass',
      }
    ],
  },
/*  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
      },
      {
        name: '分步表单',
        path: 'step-form',
      },
      {
        name: '高级表单',
        authority: 'admin',
        path: 'advanced-form',
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    children: [
      {
        name: '基础详情页',
        path: 'basic',
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },*/
  /*{
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    children: [
      {
        name: '成功',
        path: 'success',
      },
      {
        name: '失败',
        path: 'fail',
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },*/
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
      },
     /* {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },*/
    ],
  },
  {
    name: '用户',
    icon: 'phone',
    path: 'phone',
    authority: 'guest',
    children: [
      {
        name: '基本信息',
        path: 'info',
      },
      {
        name: '提交成功',
        path: 'success',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
