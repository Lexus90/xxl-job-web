import React, {useState} from 'react';
import ProForm, {
  QueryFilter,
  ProFormDateRangePicker,
  ProFormSelect
} from '@ant-design/pro-form';
import {useAccess, Access} from 'umi';
import {getJobsByGroup, jobInfoList} from "@/services/ant-design-pro/jobApi";

// const [jobs, setJobs] = useState<any>();

type AdvancedSearchProps = {
  onFilterChange?: (allValues: API.LogPageParams) => void;
  onSearch?: (allValues: API.LogPageParams) => void;
  initParam?: (allValues: API.LogPageParams) => void;
};

const LogSearch: React.FC<AdvancedSearchProps> = (props) => {
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
    jobId: curJobId,
  };

  const initJobs = jobGroupId => {
    setCurAppId(jobGroupId)
    const jobOptions = [];
    jobOptions.push({value: -1, label: "全部任务"})
    getJobsByGroup({jobGroup: jobGroupId})
      .then(ret => {
        ret.content?.forEach(job => {
          jobOptions.push({value: job.id, label: job.jobDesc + "[" + job.executorHandler + "]"})
        })
        setJobs(jobOptions);
        setCurJobId(jobOptions[0]?.value)
      })
  };

  return (
    <QueryFilter<{
      jobGroup: number;
      jobId: number;
      logStatus: number;
    }>
      span={4}
      ignoreRules={false}
      defaultCollapsed={false}
      initialValues={initVal}
      onInit={(values) => {
        initJobs(initVal.jobGroup);
        props.initParam?.(initVal);
      }}

      onFinish={async (values) => {
        props.onSearch?.(values);
      }}
    >
      <ProFormSelect width={"sm"} placeholder={"请选择APP_ID"} name="jobGroup"
                     // label={"服务"}
                     showSearch
                     options={openList}
                     fieldProps={{
                       onChange: (e) => initJobs(e),
                     }}/>

      <ProFormSelect name="jobId" showSearch options={jobs}
                     // label={"任务"}
                     colSize={1}
                     fieldProps={{
                       // style: {maxWidth: 150},
                       value: curJobId,
                       onChange: (jobId) => setCurJobId(jobId)
                     }}
      />

      <ProFormSelect name="logStatus"
                     // label={"状态"}
                     fieldProps={{
                       // style: {maxWidth: 70},
                     }}
                    // colSize={0.5}
                     options={[
                       {value: 0, label: '全部状态',},
                       {value: 1, label: '成功',},
                       {value: 2, label: '失败',},
                       {value: 3, label: '运行中',},
                     ]}/>

      <ProFormDateRangePicker name="filterTime"
                              tooltip= "调度时间"

                              placeholder={["调度","时间"]}
                              // label="调度时间"
                              fieldProps={{
                                // style: {maxWidth: 170},
                              }}
                              colSize={2}
      />

    </QueryFilter>
  );
};

export default LogSearch;
