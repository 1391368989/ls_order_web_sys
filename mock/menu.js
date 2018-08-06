import { isUrl } from '../src/utils/utils';
const menuData = [
  {
    name: '仪表盘',
    icon: 'dashboard',
    path: 'dashboard',
    children: [
      {
        name: '工作台',
        path: 'workplace',
      },
      {
        name: '盈亏分析',
        path: 'analysis',
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
export const getMenuData = formatter(menuData);
