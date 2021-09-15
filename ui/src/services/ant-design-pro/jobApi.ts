import { request } from 'umi';
import {handResult} from "@/services/ant-design-pro/api";
import {API_PATH} from "@/utils/utils";


/** 获取APP_ID列表 POST /api/jobgroup/pageList */
export async function jobInfoList(
    params: {
        jobGroup?: number;
        jobDesc?:string;
        triggerStatus?: number;
        start?: number;
        length?: number;
    },
    options?: { [key: string]: any },
  ) {
  console.log("process.env = {}" , process.env);
    return request<API.JobList>(API_PATH+'/jobinfo/pageList', {
      method: 'POST',
      params: {
      ...{jobGroup: params.jobGroup,triggerStatus: -1,}||params

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
    return request<API.JobList>(API_PATH+'/joblog/getJobsByGroup', {
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
    return request<API.ReturnT>(API_PATH+'/jobgroup/update', {
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
    return request<API.ReturnT>(API_PATH+'/jobgroup/save', {
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
    return request<API.ReturnT>(API_PATH+'/jobgroup/remove', {
      method: 'POST',
      params: {...params},
      ...(options || {}),
    }).then(handResult);
  }
