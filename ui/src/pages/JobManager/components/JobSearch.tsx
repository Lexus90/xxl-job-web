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
import styles from './style.less';

type AdvancedSearchProps = {
  onFilterChange?: (allValues: API.LogPageParams) => void;
  onSearch?: (allValues: API.LogPageParams) => void;
  initParam?: (allValues: API.LogPageParams) => void;
};

const JobSearch: React.FC<AdvancedSearchProps> = (props) => {
  const [curAppId, setCurAppId] = useState<number>(0);
  const access = useAccess();

  const openList = [];
  access.accessApps?.forEach(function (e) {
    openList.push({label: e.appname + "[" + e.title + "]", value: e.id})
  })

  const initVal = {
    logStatus: 0,
    jobGroup: access.accessApps[0]?.id,
    triggerStatus:-1,
  };

  const initJobs = jobGroupId => {
    setCurAppId(jobGroupId)
  };

  return (
      <QueryFilter<{
        jobGroup: number;
        jobDesc: string;
        executorHandler: string;
        triggerStatus: number;
      }>
        span={4}
        defaultCollapsed={false}
        initialValues={initVal}
        onInit={(values) => {
          initJobs(initVal.jobGroup);
          props.initParam?.(initVal);
        }}

        onFinish={async (values) => {
          console.log("values = {}", values);
          props.onSearch?.(values);
        }}
      >

        <ProFormSelect width={"sm"} placeholder={"请选择APP_ID"} name="jobGroup"
                       showSearch
                       options={openList}
                       fieldProps={{
                         onChange: (e) => initJobs(e),
                       }}/>

        <ProFormSelect name="triggerStatus" width="sm"
                       options={[
                         {value: -1, label: '全部状态',},
                         {value: 1, label: '运行中',},
                         {value: 0, label: '停止',},
                       ]}/>

        <ProFormText name="jobDesc" placeholder="请输入任务描述" width="sm"/>

        <ProFormText name="executorHandler" placeholder="请输入JobHandler" width="sm"/>
      </QueryFilter>
  );
};

export default JobSearch;
