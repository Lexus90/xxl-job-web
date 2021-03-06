import {
  DeleteFilled, DeleteTwoTone,
  EditFilled,
  EditOutlined,
  EditTwoTone,
  PlusOutlined,
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
import type { FormValueType } from './components/AppUpdateForm';
import AppUpdateForm from './components/AppUpdateForm';
import {appList, updateApp, addApp, removeApp} from '@/services/ant-design-pro/appApi';
import { useAccess, Access } from 'umi';
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.AppInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addApp({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！'+error.message);
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
    await updateApp({
      ...fields
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！'+error.message);
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRow: API.AppInfo) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;

  console.log("selectedRow = " + selectedRow.appname );

  try {
    await removeApp({
      id: selectedRow.id,
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试'+error.message);
    return false;
  }
};

const AppManager: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.AppInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.AppInfo[]>([]);

  /** 国际化配置 */
  const intl = useIntl();
  const access = useAccess();

  const columns: ProColumns<API.AppInfo>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.id"
          defaultMessage="ID"
        />
      ),
      dataIndex: 'id',
      hideInTable: true,
      hideInSearch:true,
      hideInDescriptions: true,
    },
    {

      title: (
        <FormattedMessage
          id="pages.searchTable.appId"
          defaultMessage="APP_ID"
        />
      ),
      dataIndex: 'appname',
      tip: '应用英文名',
    },

    {
      title: (
        <FormattedMessage
          id="pages.searchTable.appName"
          defaultMessage="名称"
        />
      ),
      dataIndex: 'title',
      tip: '应用中文名',
    },
    {
      title: <FormattedMessage id="pages.searchTable.owner" defaultMessage="负责人" />,
      dataIndex: 'owner',
      valueType: 'textarea',
      hideInSearch:true,
      render: (dom, entity) => {
        return (<Tag color={"orange"}>{dom}</Tag>);
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.addressType" defaultMessage="注册方式" />,
      dataIndex: 'addressType',
      valueType: 'textarea',
      hideInSearch:true,
      render: (dom, entity) => {
        return (
        <Space>
          {entity.addressType == 0 ? <Tag color="blue">自动注册</Tag>  : <Tag color="red">手动注册</Tag>}
        </Space>

        )
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.addressList"
          defaultMessage="在线节点数量"
        />
      ),
      hideInSearch:true,
      dataIndex: 'registryList',
      render: (dom, entity) => {
        return (
            <Space>
              <a>
                { entity.addressList ?
                  <Tooltip placement="top"
                           title={<div dangerouslySetInnerHTML={{__html:entity.addressList.replaceAll(",","<br/>")}}></div>}>
                    <Tag color="blue">{entity.addressList?.split(",").length}{"个节点"}</Tag>
                  </Tooltip>
                  : <Tag color="red">{"无节点"}</Tag>
                }
              </a>
            </Space>
        );
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
      hideInTable: !access.accessAble,
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <Tooltip placement="left" title={"编辑服务"}><EditTwoTone /></Tooltip>
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
                      title= { "确认删除"+record.appname+"?"}
                      onConfirm={
                        async () => {
                          await handleRemove(record);
                          actionRef.current?.reloadAndRest?.();
                        }}>
            <Tooltip placement="left" title={"删除服务"}><DeleteTwoTone twoToneColor={'red'} /></Tooltip>
          </Popconfirm>
        </a>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AppInfo, API.AppPageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.app.title',
          defaultMessage: '服务列表',
        })}

        showHeader={false}

        actionRef={actionRef}
        rowKey="id"
        search={{
          filterType: 'query',
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
        request={appList}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newApp',
          defaultMessage: '新建服务',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.AppInfo);
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
                  id="pages.searchTable.appId"
                  defaultMessage="请输入APP_ID"
                />
              ),
            },
          ]}
          width="md"
          name="appname"
          placeholder="请输入APP_ID"
          label="APP_ID"
        />
        <ProFormText
            rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.appName"
                  defaultMessage="请输入服务名称"
                />
              ),
            },
          ]}
          width="md" name="title" placeholder="请输入服务名称" label="服务名称"/>
        <ProFormText
          rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.owner"
                defaultMessage="请输入项目Owner"
              />
            ),
          },
        ]} width="md" name="owner" placeholder="请输入项目Owner" label="项目Owner"/>
        <ProFormRadio.Group width="md" name="addressType" label="注册类型" options={[
          {
            label: '自动注册',
            value: 0,
          },
          {
            label: '手动注册',
            value: 1,
          },
        ]}/>
      </ModalForm>

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
        {currentRow?.appname && (
          <ProDescriptions<API.AppInfo>
            column={2}
            title={currentRow?.appname}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.AppInfo>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default AppManager;
