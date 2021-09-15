// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {handResult} from "@/services/ant-design-pro/api";

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
      start: !params.current ? 0 : (params.current-1) * params.pageSize,
      author: !params.author ? "" :params.author,
      length: params.pageSize,
    },
    ...(options || {}),
  });
}

/** 添加 job jobinfo/add */

export async function addJob(
  params: {
    jobGroup?: number;
    jobDesc?: string;
    author?: string;
    alarm?: number;
    scheduleType?: string;
    scheduleConf?: string;
    cronGen_display?: string;
    schedule_conf_CRON?: string;
    schedule_conf_FIX_RATE?: string;
    schedule_conf_FIX_DELAY?: string;
    glueType?: string;
    executorHandler?: string;
    executorParam?: string;
    executorRouteStrategy?: string;
    childJobId?: number;
    misfireStrategy?: string;
    executorBlockStrategy?: string;
    executorTimeout?: string;
    executorFailRetryCount?: number;
    glueRemark?: string;
    glueSource?: string;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobinfo/add', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}

export async function update(
  params: {
    id?: number;
    jobGroup?: number;
    jobDesc?: string;
    author?: string;
    alarm?: number;
    scheduleType?: string;
    scheduleConf?: string;
    cronGen_display?: string;
    schedule_conf_CRON?: string;
    schedule_conf_FIX_RATE?: string;
    schedule_conf_FIX_DELAY?: string;
    glueType?: string;
    executorHandler?: string;
    executorParam?: string;
    executorRouteStrategy?: string;
    childJobId?: number;
    misfireStrategy?: string;
    executorBlockStrategy?: string;
    executorTimeout?: string;
    executorFailRetryCount?: number;
    glueRemark?: string;
    glueSource?: string;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobinfo/update', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}
export async function remove(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobinfo/remove?id='+ params.id, {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}

/** 启动任务*/
export async function start(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobinfo/start?id='+ params.id, {
    method: 'GET',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}

/** 停止任务*/
export async function stop(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobinfo/stop?id='+ params.id, {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}

/**触发一次执行*/
export async function trigger(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobinfo/trigger', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  }).then(handResult);
}
/**下次执行时间*/
export async function nextTriggerTime(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.ReturnT>('/api/jobinfo/nextTriggerTime', {
    method: 'POST',
    params: {...params},
    ...(options || {}),
  });
}
/**查询注册信息*/
export async function registerInfo(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.JobGroup>('/api/jobgroup/loadById', {
    method: 'GET',
    params: {...params},
    ...(options || {}),
  });
}/**查询注册信息*/
export async function getJobsByGroup(
  params: {
    id?: number;
  },
  options?: { [key: string]: any }
  ) {
  return request<API.JobGroup>('/api/jobgroup/loadById', {
    method: 'GET',
    params: {...params},
    ...(options || {}),
  });
}








