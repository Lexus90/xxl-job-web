// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {handleResult} from "@/services/ant-design-pro/api";

const roleEnum =  {
  all: -1,
  normal: 0,
  admin:1,
}

/** 获取user列表 POST /api/user/pageList */
export async function userList(
  params: {
    username?: string;
    role?: number;
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.UserList>('/api/user/pageList', {
    method: 'POST',
    params: {
      role: roleEnum[params.role],
      username: params.username,
      start: params.current-1,
      length: params.pageSize,
    },
    ...(options || {}),
  });
}
/** 更新APP_ID POST /api/user/update */
export async function updateUser(
  params: {
    id?: number;
    username?: string;
    password?: string;
    role?: number;
    permission?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/user/update', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handleResult);
}

/** 新建APP_ID POST /api/user/update */
export async function addUser(
  params: {
    id?: number;
    username?: string;
    password?: string;
    role?: number;
    permission?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/user/add', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  });
}

/** 删除APP_ID POST /api/user/update */
export async function removeUser(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }) {
  return request<API.ReturnT>('/api/user/remove', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handleResult);
}
