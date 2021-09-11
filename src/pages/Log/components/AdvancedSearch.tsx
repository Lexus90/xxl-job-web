import React, {useState} from 'react';
import {Card, Col, Input, Row, Select, Tabs} from 'antd';
import {UpOutlined, DownOutlined} from '@ant-design/icons';
import ProForm, {
  QueryFilter,
  ProFormText,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect
} from '@ant-design/pro-form';
import {useAccess, Access} from 'umi';

// const [jobs, setJobs] = useState<any>();

type AdvancedSearchProps = {
  onFilterChange?: (allValues: API.LogPageParams) => void;
  onSearch?: (allValues: API.LogPageParams) => void;
  initParam?: (allValues: API.LogPageParams) => void;
};

const AdvancedSearch: React.FC<AdvancedSearchProps> = (props) => {
  const [jobs, setJobs] = useState<{ value: number, label: string }[]>([]);
  const access = useAccess();
  const openList = [];
  let xxlJobId = 0;
  access.accessApps?.forEach(function (e) {
    openList.push({label: e.appname + "[" + e.title + "]", value: e.id})
    if ("ci-xxl-job-svc".endsWith(e.appname)) {
      xxlJobId = e.id;
    }
  })

  function getJobGroup() {
    // return access.accessApps[0].id;
    return xxlJobId;
  }

  const handleAppChange = id => {
    let jo1 = [];
    console.log("value = " + id);
    if (id == 1) {
      jo1 = [
        {value: 1, label: "xxx1"},
        {value: 2, label: "xxx2"},
        {value: 3, label: "xxx3"},
      ];
    } else {
      jo1 = [
        {value: 4, label: "xxx4"},
        {value: 5, label: "xxx5"},
        {value: 6, label: "xxx6"},
      ];
    }
    console.log("jo1=" + jo1);
    setJobs(jo1);
  };

  const initVal = {
    logStatus: 1,
    jobGroup: getJobGroup(),
  };


  return (
    <QueryFilter<{
      jobGroup: number;
      jobId: string;
      logStatus: number;
    }>
      defaultCollapsed={false}
      initialValues={initVal}

      onInit={(values) => {
        props.initParam?.(initVal);
      }}

      onFinish={async (values) => {
        props.onSearch?.(values);
        console.log("onFinish=" + values.logStatus);
      }}
    >

      <ProFormSelect width={"sm"} placeholder={"请选择APP_ID"} name="jobGroup" label="服务" showSearch
                     options={openList}
                     fieldProps={{
                       onChange: (e) => handleAppChange(e),
                     }}/>

      <ProFormSelect name="jobId" label="任务" width="sm" showSearch options={jobs}/>

      <ProFormSelect name="logStatus" label="状态" width="sm"
                     options={[
                       {value: 0, label: '全部',},
                       {value: 1, label: '成功',},
                       {value: 2, label: '失败',},
                       {value: 3, label: '运行种',},
                     ]}/>

      <ProFormDateRangePicker name="filterTime" label="调度时间" colSize={1}/>

    </QueryFilter>
  );
};

export default AdvancedSearch;
