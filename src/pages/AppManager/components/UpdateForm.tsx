import React from 'react';
import { Modal } from 'antd';
import ProForm, {
  ModalForm,
  ProFormDateRangePicker, ProFormRadio, ProFormSelect, ProFormText,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.AppInfo>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  handleUpdateModalVisible: boolean;
  values: Partial<API.AppInfo>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm<{
      id?: number;
      appname?: string;
      title?: string;
      owner?: string;
      addressType?: number;
      addressList?: string;
      updateTime?: string;
      registryList?: string;
    }>
      title={intl.formatMessage({
        id: 'pages.searchTable.createForm.updateApp',
        defaultMessage: '修改服务',
      })}
      width="400px"
      destroyOnClose
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
        initialValue={props.values.appname}
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
        initialValue={props.values.title}
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
        ]}
        initialValue={props.values.owner}
        width="md" name="owner" placeholder="请输入项目Owner" label="项目Owner"/>
      <ProFormRadio.Group
        initialValue={props.values.addressType}
        width="md" name="addressType" label="注册类型" options={[
        {
          label: '自动注册',
          value: 0,
        },
        {
          label: '手动注册',
          value: 1,
        },
      ]}/>
      <ProFormText
        name="addressList"
        initialValue={props.values.addressList}
      />
    </ModalForm>
  );
};

export default UpdateForm;
