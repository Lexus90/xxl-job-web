import React, { useState } from 'react';
import {Card, Input, Select, Tabs} from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import ProForm, {
  QueryFilter,
  ProFormText,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect
} from '@ant-design/pro-form';
import { useAccess, Access } from 'umi';

type AdvancedSearchProps = {
  onFilterChange?: (allValues: API.LogPageParams) => void;
  onSearch?: (allValues: API.LogPageParams) => void;
  initParam?: (allValues: API.LogPageParams) => void;
};

const AdvancedSearch: React.FC<AdvancedSearchProps> = (props) => {
  const access = useAccess();
  const openList = [];
  access.accessApps?.forEach(function (e){
    openList.push({label: e.appname+"["+e.title+"]", value: e.id})
  })

  function getJobGroup() {
    // return access.accessApps[0].id;
    return 0;
  }

  const initVal = {
    logStatus: 1,
    jobGroup: getJobGroup(),
  };

  return (
    <QueryFilter<{
      appId: number;
      job: string;
      status: number;
    }>
      initialValues= {initVal}

      onInit={(values)=>{
        props.initParam?.(initVal);
      }}

      onFinish = {async (values) => {
        props.onSearch?.(values);
        console.log("onFinish="+values.logStatus);
      }}
    >
      <ProFormSelect placeholder={"请选择APP_ID"}  name="jobGroup" label="服务" showSearch
                     options={openList}
      />
      <ProFormSelect  name="jobId" label="任务" width="sm" showSearch valueEnum={{
                                                      job: 'job1',
                                                    }}
      />
      <ProFormSelect name="logStatus" label="状态"  width="sm"
                     options={[
                       {value: 0, label: '全部',},
                       {value: 1, label: '成功',},
                       {value: 2, label: '失败',},
                       {value: 3, label: '运行种',},
                     ]}
        // valueEnum={{
        //   0: '全部',
        //   1: '成功',
        //   2: '失败',
        //   3: '运行中',
        // }}
      />

      <ProFormDateRangePicker name="filterTime" label="调度时间" colSize={3} />
    </QueryFilter>
  );
};

export default AdvancedSearch;
