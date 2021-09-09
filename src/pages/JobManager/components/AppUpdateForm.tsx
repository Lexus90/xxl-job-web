import React from 'react';
import { Modal } from 'antd';
import ProForm, {
  ModalForm,
  ProFormDateRangePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

export type FormValueType = {
  id?: number;
  jobGroup: number;
  jobDesc: string;
  author: string;
  alarm: number;
  scheduleType: string;
  scheduleConf: string;
  misfireStrategy: string;
  executorRouteStrategy: string;
  executorHandler: string;
  executorParam: string;
  executorBlockStrategy: string;
  executorTimeout: number;
  executorFailRetryCount: number;
  glueType: string;
  glueSource: string;
  glueRemark: string;
  glueUpdatetime: Date;
  childJobId: string;
} & Partial<API.AppInfo>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  handleUpdateModalVisible: boolean;
  values: Partial<API.AppInfo>;
};

const AppUpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm<{
      id?: number;
      jobGroup: number;
      jobDesc: string;
      author: string;
      alarm: number;
      scheduleType: string;
      scheduleConf: string;
      misfireStrategy: string;
      executorRouteStrategy: string;
      executorHandler: string;
      executorParam: string;
      executorBlockStrategy: string;
      executorTimeout: number;
      executorFailRetryCount: number;
      glueType: string;
      glueSource: string;
      glueRemark: string;
      glueUpdatetime: Date;
      childJobId: string;
    }>
      title={intl.formatMessage({
        id: 'pages.searchTable.createForm.updateApp',
        defaultMessage: '修改服务',
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
                id="pages.searchTable.jobGroup"
                defaultMessage="请输入服务id"
              />
            ),
          },
        ]}
        width="md"
        name="jobGroup"
        placeholder="请输入服务id"
        label="jobGroupId"
        initialValue={props.values.appname}
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.jobName"
                defaultMessage="请输入任务名称"
              />
            ),
          },
        ]}
        initialValue={props.values.title}
        width="md" name="jobDesc" placeholder="请输入任务名称" label="任务名称"/>
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
      <ProFormTextArea
        name="addressList"
        initialValue={props.values.addressList}
      />
    </ModalForm>
  );
};

export default AppUpdateForm;
