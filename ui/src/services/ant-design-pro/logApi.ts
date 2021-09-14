// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {handleResult} from "@/services/ant-design-pro/api";

/** 获取APP_ID列表 POST /api/jobgroup/pageList */
export async function logList(
  params: {
    jobGroup?: number;
    jobId?: number;
    logStatus?: number;
    filterTime?: string;
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.LogList>('/api/joblog/pageList', {
    method: 'POST',
    params: {
      jobGroup: !params.jobGroup ? 0 : params.jobGroup,
      jobId: !params.jobId ? -1 : params.jobId,
      logStatus: !params.logStatus ? -1 :params.logStatus,
      filterTime: params.filterTime,
      start: 0,
      length: params.pageSize ? 10:params.pageSize,
    },
    ...(options || {}),
  });
}
/** 删除APP_ID POST /api/jobgroup/update */
export async function removeLog(
  params: {
    jobGroup?: number;
    jobId?: number;
    type?: number;
  },
  options?: { [key: string]: any }) {
  return request<API.ReturnT>('/api/joblog/clearLog', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handleResult);
}

export async function stopJob(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }) {
  return request<API.ReturnT>('/api/joblog/logKill', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handleResult);
}


const openList = [];

const fillChil = (a : API.AppInfo) => {
  // console.log("openList = " +a.appname);
  openList.push("<Option key={a.appname}>{a.title}</Option>");
}

const handle =(result : API.LogBaseInfo) => {
  result.content?.JobGroupList?.forEach(fillChil);

}

export function logBaseInfo(
  params: {
    jobId?: number;
    logStatus?: number;
  },
  options?: { [key: string]: any }) {
   request<API.LogBaseInfo>('/api/joblog/baseInfo', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handle);

  let openList1 = openList;
  return openList1;
}
