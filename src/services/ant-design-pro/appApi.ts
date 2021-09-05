// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {handResult} from "@/services/ant-design-pro/api";

/** 获取APP_ID列表 POST /api/jobgroup/pageList */
export async function appList(
  params: {
    appname?: number;
    title?: number;
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.AppList>('/api/jobgroup/pageList', {
    method: 'POST',
    params: {
      appname: params.appname,
      title: params.title,
      start: params.current-1,
      length: params.pageSize,
    },
    ...(options || {}),
  });
}
/** 更新APP_ID POST /api/jobgroup/update */
export async function updateApp(
  params: {
    id?: number;
    appname?: string;
    title?: string;
    owner?: string;
    addressType?: number;
    addressList?: string;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobgroup/update', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}

/** 新建APP_ID POST /api/jobgroup/update */
export async function addApp(
  params: {
    appname?: string;
    title?: string;
    owner?: string;
    addressType?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobgroup/save', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}

/** 删除APP_ID POST /api/jobgroup/update */
export async function removeApp(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }) {
  return request<API.ReturnT>('/api/jobgroup/remove', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}
