﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/',
    redirect: '/data-batch-import',
  },
  {
    name: '数据批导',
    icon: 'ImportOutlined',
    path: '/data-batch-import',
    auth: true,
    routes: [
      {
        name: '数据导入',
        path: '/data-batch-import/index',
        component: './DataBatchImport',
      },
      {
        name: '导入记录',
        path: '/data-batch-import/record',
        component: './DataBatchImport/History',
      },
    ],
  },
  {
    name: '报告管理',
    icon: 'table',
    path: '/report-management',
    routes: [
      {
        name: '报告下载',
        path: '/report-management/index',
        component: './ReportManagement',
      },
      {
        name: '下载记录',
        path: '/report-management/record',
        component: './ReportManagement/History',
      }
    ]
  },
  {
    layout: false,
    name: 'login',
    path: '/login',
    component: './User/Login',
  },
  {
    layout: false,
    name: 'active',
    path: '/active',
    component: './ActiveDY',
  },
  {
    name: '商品管理',
    icon: 'shopping',
    path: '/goods',
    routes: [
      {
        path: '/goods',
        redirect: '/goods/commission-management',
      },
      {
        path: '/goods/commission-management',
        name: '商品佣金',
        component: './Goods/Management',
      },
      {
        path: '/goods/sales',
        name: '商品订单',
        component: './Goods/Sales',
      },
      {
        path: '/goods/shop',
        name: '供应链',
        component: './Goods/Shop',
      },
    ],
  },
  {
    name: '财务管理',
    icon: 'AccountBookOutlined',
    path: '/finances',
    auth: true,
    routes: [
      {
        path: '/finances',
        redirect: '/finances/split',
      },
      {
        path: '/finances/split',
        name: '分账配置',
        component: './Finances',
      },
      {
        name: '联创公司',
        icon: 'ShopOutlined',
        path: '/finances/cooperator-list',
        component: './CooperatorList',
      },
      {
        name: '平台账号',
        icon: 'ContactsOutlined',
        path: '/finances/accounts',
        component: './Accounts',
      },
      {
        path: '/finances/ip_pay',
        name: 'IP费用',
        component: './Finances/IpPay',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'team',
    path: '/users',
    component: './UserControl',
    auth: true,
  },
  
  {
    path: '*',
    layout: false,
    component: './404',
  },
];
