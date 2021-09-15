import {
  DeleteFilled, DeleteTwoTone,
  EditFilled,
  EditOutlined,
  EditTwoTone,
  PlusOutlined, PoweroffOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import {Button, message, Input, Drawer, Popconfirm, Space, Tag, Select, Tooltip} from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm, ProFormCheckbox,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UserUpdateForm';
import UserUpdateForm from './components/UserUpdateForm';
import {userList, updateUser, addUser, removeUser} from '@/services/ant-design-pro/userApi';
import {Access, useAccess} from "@@/plugin-access/access";
/**
 * 添加节点
 *
 * @param fields
 */
const handleAdd = async (fields: API.User) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
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
    await updateUser({
      ...fields
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
const handleRemove = async (selectedRow: API.User) => {
  const hide = message.loading('正在删除');
  if (!selectedRow) return true;

  try {
    await removeUser({
      id: selectedRow.id,
    });
    hide();

    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试, '+error.message);
    return false;
  }
};

const UserManager: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [deleteModalVisible, handleDeleteModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.User>();
  const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);

  /** 国际化配置 */
  const intl = useIntl();
  const access = useAccess();

  const columns: ProColumns<API.User>[] = [
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
          id="pages.searchTable.userName"
          defaultMessage="账号"
        />
      ),
      dataIndex: 'username',
    },
    {
      title: <FormattedMessage id="pages.searchTable.role" defaultMessage="角色" />,
      dataIndex: 'role',
      valueType: 'select',
      initialValue: "all",
      valueEnum: {
        all: '全部',
        normal: '普通用户',
        admin: '管理员',
      },
      render: (dom, entity) => {
        return (
        <Space>
          {entity.role == 0 ? <Tag color="blue">普通用户</Tag>  : <Tag color="red">管理员</Tag>}
        </Space>

        )
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.password" defaultMessage="密码" />,
      dataIndex: 'password',
      valueType: 'textarea',
      hideInTable: true,
      hideInDescriptions: true,
      hideInSearch:true,
      render: (dom, entity) => {
        return (<Tag color={"orange"}>{dom}</Tag>);
      },
    },
    {
      title: (
        <FormattedMessage
          id="pages.searchTable.updateForm.permission"
          defaultMessage="权限"
        />
      ),
      hideInSearch:true,
      dataIndex: 'permission',
      render: (dom, entity) => {
        return (
            <Space
                onClick={() => {
                  setCurrentRow(entity);
                  setShowDetail(true);
                }}
              >
              <a>
                { entity.permission ?
                    <Tag color="blue">{entity.permission?.split(",").length}</Tag>
                    : <Tag color="red">{"无权限"}</Tag>
                }
              </a>
            </Space>
        );
      },
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
          <Tooltip placement="left" title={"编辑用户"}><EditTwoTone /></Tooltip>
        </a>
        ,

        <a
          key="del"
          onClick={() => {
            handleDeleteModalVisible(true);
            setCurrentRow(record);
          }}
        >
          <Popconfirm id="pages.searchTable.deletion"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      title= { "确认删除"+record.username+"?"}
                      onConfirm={
                        async () => {
                          await handleRemove(record);
                          actionRef.current?.reloadAndRest?.();
                        }}>
            <Tooltip placement="left" title={"删除用户"}><DeleteTwoTone twoToneColor={'red'} /></Tooltip>
          </Popconfirm>
        </a>
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.User, API.UserPageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.user.title',
          defaultMessage: '用户列表',
        })}
        size={"small"}
        options={{density:false, reload:false}}
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
        request={userList}
        columns={columns}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.newUser',
          defaultMessage: '添加用户',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.User);
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
                  id="pages.searchTable.userName"
                  defaultMessage="请输入账号"
                />
              ),
            },
          ]}
          width="md"
          name="username"
          placeholder="请输入账号"
          label="账号"
        />
        <ProFormText
          rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.password"
                defaultMessage="请输密码"
              />
            ),
          },
        ]} width="md" name="password" placeholder="请输密码" label="密码"/>
        <ProFormRadio.Group width="md" name="role" label="角色" options={[
          {
            label: '普通用户',
            value: 0,
          },
          {
            label: '管理员',
            value: 1,
          },
        ]}/>
        <ProFormCheckbox width="md" name="permission" label="权限"/>
      </ModalForm>

      <UserUpdateForm
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
        {currentRow?.username && (
          <ProDescriptions<API.User>
            column={2}
            title={currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<API.User>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default UserManager;
