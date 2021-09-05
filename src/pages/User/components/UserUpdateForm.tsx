import React from 'react';
import { Modal } from 'antd';
import ProForm, {
  ModalForm, ProFormCheckbox,
  ProFormDateRangePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.User>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  handleUpdateModalVisible: boolean;
  values: Partial<API.User>;
};

const UserUpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm<{
      id?: number;
      username?: string;
      password?: string;
      role?: number;
      permission?: number;
    }>
      title={intl.formatMessage({
        id: 'pages.searchTable.createForm.updateUser',
        defaultMessage: '修改用户',
      })}
      width="400px"
      visible={props.updateModalVisible}
      onVisibleChange={props.handleUpdateModalVisible}
      onFinish={props.onSubmit}
      modalProps={{
        onCancel: ()=>props.onCancel,
        destroyOnClose: true,
      }}

    >
      <ProFormText
        name="id"
        initialValue={props.values.id}
        hidden={true}

      />
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.userName"
                defaultMessage="请输入用户名称"
              />
            ),
          },
        ]}
        initialValue={props.values.username}
        width="md" name="title" placeholder="请输入用户名称" label="用户名称"/>
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.password"
                defaultMessage="请输入密码"
              />
            ),
          },
        ]}
        initialValue={props.values.password}
        width="md" name="password" placeholder="请输入密码" label="密码"/>
      <ProFormRadio.Group
        initialValue={props.values.role}
        width="md" name="role" label="角色" options={[
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
  );
};

export default UserUpdateForm;
