import {
  DeleteFilled, DeleteTwoTone,
  EditFilled,
  EditOutlined,
  EditTwoTone,
  PlusOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import {Button, message, Input, Drawer, Popconfirm, Space, Tag} from 'antd';
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
import type { FormValueType } from './components/AppUpdateForm';
import type { CreateFormValueType } from './components/JobCreateForm';
import AppUpdateForm from './components/AppUpdateForm';
import {jobInfoList, updateJobInfo, addJobInfo, removeJobInfo} from '@/services/ant-design-pro/jobApi';
import { useAccess, Access } from 'umi';
import JobCreateForm from './components/JobCreateForm';
import JobSearch from "@/pages/JobManager/components/JobSearch";
import LogSearch from "@/pages/Log/components/LogSearch";
import {logList} from "@/services/ant-design-pro/logApi";

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: CreateFormValueType) => {
  const hide = message.loading('正在添加');
  try {
    await addJobInfo({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！'+ error);
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateJobInfo({
      ...fields
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！'+ error);
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: API.JobInfo) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;

  console.log("selectedRow = " + selectedRow.id );

  try {
    await removeJobInfo({
      id: selectedRow.id,
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试'+error);
    return false;
  }
};

const AppManager: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);
  const [param, setParam] = useState<API.JobPageParams>();
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.JobInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.JobInfo[]>([]);

  /** 国际化配置 */
  const intl = useIntl();
  const access = useAccess();

  const columns: ProColumns<API.JobInfo>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.job.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      // hideInTable: true,
      hideInSearch:true,
      // hideInDescriptions: true,
    },
    {
      title: (
        <FormattedMessage
          id="pages.jobManager.jobDesc"
          defaultMessage="Job_Desc"
        />
      ),
      dataIndex: 'jobDesc',
      tip: '任务描述',
      // hideInSearch:true,
    },

    {
      title: (<FormattedMessage id="pages.jobManager.scheduleConf" defaultMessage="调度类型"/>),
      dataIndex: 'scheduleConf',
      tip: '调度类型',
      hideInSearch:true,
      render: (dom, entity) => {
        return  entity.scheduleType + ": " + entity.scheduleConf
      }
    },
    {
      title: (<FormattedMessage id="pages.jobManager.glueType" defaultMessage="运行模式"/>),
      dataIndex: 'glueType',
      tip: '运行模式',
      hideInSearch:true,
      render: (dom, entity) => {
        return  entity.glueType + ": " + entity.executorHandler
      }
    },

    {
      title: (<FormattedMessage id="pages.jobManager.author" defaultMessage="负责人"/>),
      dataIndex: 'author',
      tip: '负责人',
      hideInSearch:true,
    },
    {
      title: <FormattedMessage id="pages.jobManager.triggerStatus" defaultMessage="状态" />,
      dataIndex: 'triggerStatus',
      // hideInSearch:true,
      valueEnum: {
          1 :{
            text: "Running"
          },
          0: {
            text: "STOP"
          },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.addressList" defaultMessage="节点列表" />,
      dataIndex: 'addressList',
      valueType: 'textarea',
      hideInSearch:true,
      hideInTable: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInDescriptions: true,
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <Access accessible={access.isAdmin}><EditTwoTone /></Access>
        </a>,

        <a
          key="del"
          onClick={() => {
            handleDeleteModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <Popconfirm id="pages.searchTable.deletion"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      title= { "确认删除"+record.id+"?"}
                      onConfirm={
                        async () => {
                          await handleRemove(record);
                          actionRef.current?.reloadAndRest?.();
                        }}>
            <Access accessible={access.isAdmin}>
              <a ><DeleteTwoTone twoToneColor={'red'} /></a>
            </Access>

          </Popconfirm>
        </a>
      ],
    },
  ];

  return (
    <PageContainer>
      <JobSearch onSearch={(allValues)=>{
        setParam(allValues);
        actionRef.current?.reload();
      }}
                 initParam={(allValues)=>{
                   setParam(allValues);
                 }} />
      <ProTable<API.JobInfo, API.JobPageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.jobManager.job.title',
          defaultMessage: '任务列表',
        })}

        // showHeader={false}

        actionRef={actionRef}
        rowKey="id"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return jobInfoList({...param,...params});
        }}
        columns={columns}
      />

      <JobCreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
          setCurrentRow(undefined);
        }}
        createModalVisible={createModalVisible}
        handleModalVisible={handleModalVisible}
        values={currentRow || {}}
      />

      <AppUpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        handleUpdateModalVisible={handleUpdateModalVisible}
        values={currentRow || {}}
      />

      {/*详情页*/}
      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<API.JobInfo>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.JobInfo>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AppManager;
