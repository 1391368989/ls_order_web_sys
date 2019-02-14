import React, { createElement } from 'react';
import { Spin } from 'antd';
import pathToRegexp from 'path-to-regexp';
import Loadable from 'react-loadable';
/*import { getMenuData } from './menu';*/

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // register models
  models.forEach(model => {
    if (modelNotExisted(app, model)) {
      // eslint-disable-next-line
      app.model(require(`../models/${model}`).default);
    }
  });

  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
        ceshi:'测试'
      });
    };
  }
  // () => import('module')
  return Loadable({
    loader: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
    loading: () => {
      return <Spin size="large" className="global-spin" />;
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login', 'menu'], () => import('../layouts/BasicLayout')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['workplace'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      /*  hideInBreadcrumb: true,
        name: '工作台',
        authority: 'admin',*/
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    //客单分析
    '/dashboard/order-analysis': {
      component: dynamicWrapper(app, [], () => import('../routes/Analysis/Analysis')),
    },
    //代理商
    '/agent/agent-info': {
      component: dynamicWrapper(app, ['agentinfo','addmember'], () => import('../routes/Agent/AgentInfo')),
    },
    //订单
    '/order/order-info': {
      component: dynamicWrapper(app, ['order'], () => import('../routes/Order/OrderInfo')),
    },
    '/order/to-be-verified': {
      component: dynamicWrapper(app, ['childOrder'], () => import('../routes/Order/ToBeVerified')),
    },
   '/order/verified-order': {
      component: dynamicWrapper(app, [], () => import('../routes/Order/VerifiedOrder')),
    },
    '/order/business-accounting-order': {
      component: dynamicWrapper(app, ['order','childOrder'], () => import('../routes/Order/BusinessAccountingOrder')),
    },
    '/order/oder-details': {
      component: dynamicWrapper(app, [], () => import('../routes/Order/OderDetails')),
    },
    //财务
    '/finance/agent-put-forward': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/AgentFiance')),
    },
    '/finance/merchant-examines': {
      component: dynamicWrapper(app, ['finance','order','childOrder'], () => import('../routes/Finance/MerchantExamine')),
    },
    '/finance/merchant-examine/merchant-examine-Details': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/Details')),
    },
    '/finance/reimbursement-information': {
      component: dynamicWrapper(app, ['dotfinance','finance','childOrder'], () => import('../routes/Finance/ReimbursementInformation')),
    },
    '/finance/reimbursement-info': {
      component: dynamicWrapper(app, ['finance'], () => import('../routes/Finance/ReimbursementInfo')),
    },
    '/finance/agent-fiance': {
      component: dynamicWrapper(app, ['finance','selecttype'], () => import('../routes/Finance/AgentPutForward')),
    },
    //用户
    '/user-set-up/user-management': {
      component: dynamicWrapper(app, [], () => import('../routes/UserSetUp/UserManagement')),
    },
    '/user-set-up/power-management': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/UserSetUp/PowerManagement')),
    },
    '/user-set-up/power-tree': {
      component: dynamicWrapper(app, ['menu'], () => import('../routes/UserSetUp/SetUpPowerTree')),
    },
    //个人设置
    '/me/me-pass': {
      component: dynamicWrapper(app, [], () => import('../routes/Me/MePass')),
    },

    /*'/form/basic-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
    },
    '/form/step-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
    },
    '/form/step-form/info': {
      name: '分步表单（填写转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },*/
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/phone': {
      component: dynamicWrapper(app, [], () => import('../layouts/MobileLayout')),
    },
    '/phone/info': {
      component: dynamicWrapper(app, ['mobile'], () => import('../routes/Mobile/UserInfo')),
    },
    '/phone/list': {
      component: dynamicWrapper(app, ['mobile'], () => import('../routes/Mobile/UserList')),
    },
    '/phone/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Mobile/Success')),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
   /* '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },*/
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  //const menuData = getFlatMenuData(getMenuData());
  const menuList = app._models.find(({ namespace }) => namespace === 'menu').state.list;
  const menuData = getFlatMenuData(menuList);
  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
