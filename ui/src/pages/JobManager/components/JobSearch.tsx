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
import {getJobsByGroup, jobInfoList} from "@/services/ant-design-pro/jobApi";
import styles from './style.less';
// const [jobs, setJobs] = useState<any>();

type AdvancedSearchProps = {
  onFilterChange?: (allValues: API.LogPageParams) => void;
  onSearch?: (allValues: API.LogPageParams) => void;
  initParam?: (allValues: API.LogPageParams) => void;
};

const JobSearch: React.FC<AdvancedSearchProps> = (props) => {
  const [jobs, setJobs] = useState<{ value: number, label: string }[]>([]);
  const [curAppId, setCurAppId] = useState<number>(0);
  const [curJobId, setCurJobId] = useState<number>(0);
  const access = useAccess();


  const openList = [];
  access.accessApps?.forEach(function (e) {
    openList.push({label: e.appname + "[" + e.title + "]", value: e.id})
  })

  const initVal = {
    logStatus: 0,
    jobGroup: access.accessApps[0]?.id,
    jobId: curJobId
  };

  const initJobs = jobGroupId => {
    setCurAppId(jobGroupId)
    const jobOptions = [];
    getJobsByGroup({jobGroup: jobGroupId})
      .then(ret => {
        ret.content?.forEach(job => {
          jobOptions.push({
            value: job.jobDesc + ":" + job.executorHandler,
            label: job.jobDesc + "[" + job.executorHandler + "]",
          })
        })
        setJobs(jobOptions);
        setCurJobId(jobOptions[0]?.value)
      })
  };

  return (
    <Card className={styles.card}>
      <QueryFilter<{
        jobGroup: number;
        jobId: number;
        triggerStatus: number;
      }>
        span={6}
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

        defaultColsNumber={2}
      >
        <ProFormSelect width={"sm"} placeholder={"请选择APP_ID"} name="jobGroup"
                       showSearch
                       options={openList}
                       fieldProps={{
                         onChange: (e) => initJobs(e),
                       }}/>

        <ProFormSelect name="jobId" showSearch options={jobs}
                       colSize={1}
                       fieldProps={{
                         value: curJobId,
                         onChange: (jobId, jobOption) => {
                           console.log("jobOption = {}", jobOption);
                           setCurJobId(jobId);
                         }

                       }}/>

        <ProFormSelect name="triggerStatus" width="sm"
                       options={[
                         {value: -1, label: '全部状态',},
                         {value: 1, label: '运行中',},
                         {value: 0, label: '停止',},
                       ]}/>

      </QueryFilter>
      <div/>
    </Card>
  );
};

export default JobSearch;
