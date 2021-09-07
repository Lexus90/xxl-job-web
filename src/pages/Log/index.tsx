import {
  DeleteFilled, DeleteTwoTone,
  EditFilled,
  EditOutlined,
  EditTwoTone,
  PlusOutlined, PoweroffOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import {Button, message, Input, Drawer, Popconfirm, Space, Tag, Tooltip} from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/LogUpdateForm';
import LogUpdateForm from './components/LogUpdateForm';
import {logList, updateLog, addLog, removeLog, stopJob} from '@/services/ant-design-pro/logApi';
import { useAccess, Access } from 'umi';
import {addUser} from "@/services/ant-design-pro/userApi";

const handleStopJob = async (fields: FormValueType) => {
  const hide = message.loading('正在终止');
  try {
    await stopJob({ id:fields.id });
    hide();
    message.success('终止成功');
    return true;
  } catch (error) {
    hide();
    message.error('终止失败请重试！');
    return false;
  }
};

const LogManager: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Log>();
  const [selectedRowsState, setSelectedRows] = useState<API.Log[]>([]);

  /** 国际化配置 */
  const intl = useIntl();
  const access = useAccess();
  const jobCodeEnum = {
    0 : ["执行中", "blue"],
    200 : ["成功", "green"],
    500 : ["失败", "red"],
  }

  const columns: ProColumns<API.Log>[] = [
    {
      title: (<FormattedMessage id="pages.searchTable.id" defaultMessage="ID"/>),
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch:true,
      hideInDescriptions: true,
    },
    {
      title: (<FormattedMessage id="pages.searchTable.jobGroup"/>),
      dataIndex: 'jobGroup',
      hideInTable:true,
      hideInDescriptions:true,
      hideInSearch:true,
    },

    {
      title: (<FormattedMessage id="pages.searchTable.appId" defaultMessage="APP_ID"/>),
      dataIndex: 'jobAppId',
      hideInDescriptions: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.executorHandler" defaultMessage="JobHandler" />,
      dataIndex: 'executorHandler',
      valueType: 'textarea',
      hideInDescriptions: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.executorHandler" defaultMessage="任务参数" />,
      dataIndex: 'executorParam',
      valueType: 'textarea',
      hideInSearch:true,
      hideInTable:true,
      hideInDescriptions:true,
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.triggerTime" defaultMessage="调度时间"/>
      ),
      valueType: 'dateTime',
      dataIndex: 'triggerTime',
      hideInDescriptions: true,
    },
    {
      title: (<FormattedMessage id="pages.searchTable.triggerCode" defaultMessage="调度结果"/>),
      dataIndex: 'triggerCode',
      hideInDescriptions: true,
      render: (dom, entity) => {
        return (<Tag color={jobCodeEnum[entity.triggerCode][1]}>{jobCodeEnum[entity.triggerCode][0]}</Tag>);
      },
    },
    {
      title: (<FormattedMessage id="pages.searchTable.triggerMsg"  defaultMessage="调度备注"/>),
      dataIndex: 'triggerMsg',
      hideInSearch: true,
      render: (dom, entity) => {
        return (
          !entity.triggerMsg ? "" :
            <Space>
              <Tooltip overlayStyle={{width:1000}} placement="left" title={<div dangerouslySetInnerHTML={{__html:entity.triggerMsg}}></div>}>
                <a><Tag color="blue">查看</Tag></a>
              </Tooltip>
            </Space>
        )
      },
      hideInDescriptions: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.executorAddress" defaultMessage="服务地址" />,
      dataIndex: 'executorAddress',
      valueType: 'textarea',
      hideInSearch:true,
      hideInTable: true,
      hideInDescriptions: true,
    },

    {
      title: <FormattedMessage id="pages.searchTable.glueType" defaultMessage="触发类型" />,
      dataIndex: 'glueType',
      valueType: 'textarea',
      hideInSearch:true,
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: (<FormattedMessage id="pages.searchTable.handleTime" defaultMessage="执行时间"/>),
      dataIndex: 'handleTime',
      valueType: 'dateTime',
      hideInDescriptions: true,
    },

    {
      title: (<FormattedMessage id="pages.searchTable.handleCode" defaultMessage="执行结果"/>),
      dataIndex: 'handleCode',
      hideInDescriptions: true,
      render: (dom, entity) => {
        return (
          entity.triggerCode == 200 ? <Tag color={jobCodeEnum[entity.handleCode][1]}>{jobCodeEnum[entity.handleCode][0]}</Tag>
          : ""
        );
      },
    },

    {
      title: (
        <FormattedMessage
          id="pages.searchTable.handleMsg"
          defaultMessage="执行备注"
        />
      ),
      dataIndex: 'handleMsg',
      render: (dom, entity) => {
        return (
          entity.handleMsg ? "" :
            <Space
              onClick={() => {
                setCurrentRow(entity);
                setShowDetail(true);
              }}
            >
              {/*<Tooltip overlayStyle={{width:1000}} placement="left" title={<div dangerouslySetInnerHTML={{__html:entity.handleMsg}}></div>}>*/}
                <a><Tag color="blue">查看</Tag></a>
              {/*</Tooltip>*/}
            </Space>
        )
      },
    },

    {
      title: <FormattedMessage id="pages.searchTable.alarmStatus" defaultMessage="告警状态" />,
      dataIndex: 'alarmStatus',
      valueType: 'textarea',
      hideInSearch:true,
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.executorFailRetryCount" defaultMessage="失败重试次数" />,
      dataIndex: 'executorFailRetryCount',
      valueType: 'textarea',
      hideInSearch:true,
      hideInTable: true,
      hideInDescriptions: true,
    },

    {
      title: <FormattedMessage id="pages.searchTable.executorShardingParam" defaultMessage="分片参数" />,
      dataIndex: 'executorShardingParam',
      valueType: 'textarea',
      hideInSearch:true,
      hideInTable: true,
      hideInDescriptions: true,
    },

    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      hideInTable: !access.accessAble,
      render: (_, record) => [
          !(record.triggerCode==200&&record.handleCode==0) ?
            <a
              key="config"
              onClick={() => {setCurrentRow(record);}}>
                <Popconfirm id="pages.searchTable.stop"
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            title= { "确认停止"+record.executorHandler+"?"}
                            onConfirm={
                              async () => {
                                await handleStopJob(record);
                                actionRef.current?.reloadAndRest?.();
                              }}>
                  <Tooltip placement="left" title={"终止任务"}><PoweroffOutlined spin={true} style={{"color":"red"}} /></Tooltip>
                </Popconfirm>
            </a>
          : ""
        ,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Log, API.LogPageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.log.title',
          defaultMessage: '日志列表',
        })}
        // showHeader={false}
        actionRef={actionRef}
        rowKey="id"
        search={{
          filterType: 'query',
        }}
        request={logList}
        columns={columns}
      />

      {/*详情页*/}
      <Drawer
        width={1000}
        visible={showDetail}
        placement="left"
        bodyStyle={{backgroundColor:"#001529", color:"white"}}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
      >
        <text style={{whiteSpace:"pre-wrap"}}>
          {"java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n" +
          "java.lang.reflect.InvocationTargetException\n\tat sun.reflect.GeneratedMethodAccessor749.invoke(Unknown Source)\n\tat sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)\n\tat java.lang.reflect.Method.invoke(Method.java:498)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY(MethodJobHandler.java:31)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute$original$IxSIU4bY$accessor$q6pau3K2(MethodJobHandler.java)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler$auxiliary$8drveUTJ.call(Unknown Source)\n\tat org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:88)\n\tat com.xxl.job.core.handler.impl.MethodJobHandler.execute(MethodJobHandler.java)\n\tat com.xxl.job.core.thread.JobThread.run(JobThread.java:161)\nCaused by: java.lang.NullPointerException\n"
          }
        </text>


        {/*{currentRow?.id && (*/}
        {/*  <ProDescriptions<API.Log>*/}
        {/*    column={2}*/}
        {/*    title={currentRow?.jobAppId +" "+ currentRow?.executorHandler}*/}
        {/*    request={async () => ({*/}
        {/*      data: currentRow || {},*/}
        {/*    })}*/}
        {/*    params={{*/}
        {/*      id: currentRow?.id,*/}
        {/*    }}*/}
        {/*    columns={columns as ProDescriptionsItemProps<API.Log>[]}*/}
        {/*  />*/}
        {/*)}*/}
      </Drawer>
    </PageContainer>
  );
};

export default LogManager;
