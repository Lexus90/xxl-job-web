// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {handResult} from "@/services/ant-design-pro/api";



/** 获取APP_ID列表 POST /api/jobgroup/pageList */
export async function jobInfoList(
    params: {
        jobGroup?: number;
        triggerStatus?: number;
        start?: number;
        length?: number;
    },
    options?: { [key: string]: any },
  ) {
    return request<API.JobList>('/api/jobinfo/pageList', {
      method: 'POST',
      params: {
        ...params
      },
      ...(options || {}),
    });
  }

  export function getJobsByGroup(
    params: {
        jobGroup?: number;
    },
    options?: { [key: string]: any },
  ) {
    return request<API.JobList>('/api/joblog/getJobsByGroup', {
      method: 'POST',
      params: {
        ...params
      },
      ...(options || {}),
    });
  }
  /** 更新APP_ID POST /api/jobgroup/update */
  export async function updateJobInfo(
    params: {
      id?: number;
    //   appname?: string;
    //   title?: string;
    //   owner?: string;
    //   addressType?: number;
    //   addressList?: string;
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
  export async function addJobInfo(
    params: {
//   appname?: string;
    //   title?: string;
    //   owner?: string;
    //   addressType?: number;
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
  export async function removeJobInfo(
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
