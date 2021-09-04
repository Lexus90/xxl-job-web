﻿export default [
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
    name: 'Dashboard',
    icon: 'dashboard',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //   ],
  // },
  {
    name: 'Job',
    icon: 'form',
    path: '/job',
    component: './TableList',
  },
  {
    name: 'Log',
    icon: 'profile',
    path: '/log',
    component: './TableList',
  },
  {
    name: 'App',
    icon: 'table',
    path: '/app',
    component: './AppManager',
  },
  {
    name: 'User',
    icon: 'user',
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
