export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    name: '任务管理',
    icon: 'table',
    path: '/job',
    component: './TableList',
  },
  {
    name: '调度日志',
    icon: 'table',
    path: '/log',
    component: './TableList',
  },
  {
    name: '服务管理',
    icon: 'table',
    path: '/app',
    component: './AppManager',
  },
  {
    name: '用户管理',
    icon: 'table',
    path: '/role',
    component: './TableList',
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
