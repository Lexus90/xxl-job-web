// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取当前的用户job GET /api/jobinfo */
export async function jobList(
  params: {
    jobGroup?: number;
    triggerStatus?: number;
    jobDesc?: string;
    executorHandler?: string;
    author?: string;
    start?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.JobInfoList>('/api/jobinfo/pageList', {
    method: 'POST',
    params: {
      jobGroup: !params.jobGroup ? 0 : params.jobGroup,
      triggerStatus: !params.triggerStatus ? -1 : params.triggerStatus,
      jobDesc: !params.jobDesc ? "" :params.jobDesc,
      executorHandler: !params.executorHandler ? "" : params.executorHandler,
      start: params.current-1,
      author: !params.author ? "" :params.author,
      length: params.pageSize,
    },
    ...(options || {}),
  });
}