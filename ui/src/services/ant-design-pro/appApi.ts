// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {handleResult} from "@/services/ant-design-pro/api";
import {API_PATH} from "@/utils/utils";

/** 获取APP_ID列表 POST /api/jobgroup/pageList */
export async function listAccessApps(
  options?: { [key: string]: any },
) {
  return request<API.AppList>(API_PATH+'/jobgroup/accessApps', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function appList(
  params: {
    appname?: number;
    title?: number;
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.AppList>(API_PATH+'/jobgroup/pageList', {
    method: 'POST',
    params: {
      appname: params.appname,
      title: params.title,
      start: !params.current ? 0 : (params.current-1) * params.pageSize,
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
  return request<API.ReturnT>(API_PATH+'/jobgroup/update', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handleResult);
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
  return request<API.ReturnT>(API_PATH+'/jobgroup/save', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handleResult);
}

/** 删除APP_ID POST /api/jobgroup/update */
export async function removeApp(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }) {
  return request<API.ReturnT>(API_PATH+'/jobgroup/remove', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handleResult);
}
