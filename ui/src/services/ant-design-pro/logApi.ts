// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {handResult} from "@/services/ant-design-pro/api";

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
      jobId: !params.jobId ? 0 : params.jobId,
      logStatus: !params.logStatus ? -1 :params.logStatus,
      filterTime: params.filterTime,
      start: params.current-1,
      length: params.pageSize,
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
  }).then(handResult);
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
  }).then(handResult);
}
