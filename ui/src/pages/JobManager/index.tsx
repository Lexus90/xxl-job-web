import { PlusOutlined ,UserOutlined,DownOutlined} from '@ant-design/icons';
import { Button, message, Input, Drawer,Menu, Dropdown} from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/JobUpdateForm';
import UpdateForm from './components/JobUpdateForm';
import { rule, addRule, updateRule, removeRule } from '@/services/ant-design-pro/api';
import { jobList} from '@/services/ant-design-pro/jobApi';

/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.RuleListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
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
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.RuleListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const JobManager: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Job>();
  const [selectedRowsState, setSelectedRows] = useState<API.Job[]>([]);

  /** 国际化配置 */
  const intl = useIntl();

  const menu =(
      <Menu>
            <Menu.Item key="runOnce" icon={<UserOutlined />}>
              执行一次
            </Menu.Item>
            <Menu.Item key="searchLog" icon={<UserOutlined />}>
              查询日志
            </Menu.Item>
            <Menu.Item key="searchRegisterNode" icon={<UserOutlined />}>
              注册节点
            </Menu.Item>
            <Menu.Item key="nextRuntime" icon={<UserOutlined />}>
              下次执行时间
            </Menu.Item>
            <Menu.Item key="run" icon={<UserOutlined />}>
              启动
            </Menu.Item>
            <Menu.Item key="edit" icon={<UserOutlined />}>
              编辑
            </Menu.Item>
            <Menu.Item key="delete" icon={<UserOutlined />}>
              删除
            </Menu.Item>
            <Menu.Item key="copy" icon={<UserOutlined />}>
              复制
            </Menu.Item>
          </Menu>
    );

  const columns: ProColumns<API.Job>[] = [
    {
      title: (
        <FormattedMessage id="pages.searchTable.id" defaultMessage="任务ID"
        />
      ),
      dataIndex: 'id',
      hideInSearch:true,
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.jobGroup" defaultMessage="服务"
        />
      ),
      dataIndex: 'jobGroup',
      hideInTable:true,
      hideInDescriptions:true,
      render:(_,record) =>(
              (record.jobGroup)+"["+(record.jobDesc)+"]"

        ),
    },
    {
      title: <FormattedMessage id="pages.searchTable.jobDesc" defaultMessage="任务描述" />,
      dataIndex: 'jobDesc',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.searchTable.scheduleType" defaultMessage="调度类型" />,
      dataIndex: 'scheduleType',
      render:(_,record) =>(
              (record.scheduleType)+": "+(record.scheduleConf)

        ),
    },
    {
      title: <FormattedMessage id="pages.searchTable.glueType" defaultMessage="运行模式" />,
      dataIndex: 'glueType',
      hideInForm: true,
      render:(_,record) =>(
              (record.glueType)+": "+(record.executorHandler)

        ),
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.author" defaultMessage="负责人" />
      ),
      dataIndex: 'author',
    },
    {
      title: (
        <FormattedMessage id="pages.searchTable.triggerStatus" defaultMessage="状态" />
      ),
      dataIndex: 'triggerStatus',
      hideInForm: false,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.all" defaultMessage="ALL" />
          ),
          status: -1,
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.stop" defaultMessage="STOP" />
          ),
          status: 0,
        },
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="RUNNING" />
          ),
          status: 1,
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Dropdown overlay={menu}>
          <Button type="primary">
            操作 <DownOutlined />
          </Button>
        </Dropdown>  
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Job, API.JobPageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: '任务列表',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
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
        request={jobList}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newRule',
          defaultMessage: '新建规则',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.ruleName"
                  defaultMessage="规则名称为必填项"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>

      <UpdateForm
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
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default JobManager;
