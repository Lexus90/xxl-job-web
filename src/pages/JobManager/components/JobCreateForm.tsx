import React from 'react';
import { Modal } from 'antd';
import ProForm, {
  ModalForm,
  ProFormDateRangePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';

export type CreateFormValueType = {
    id: number;
    jobGroup: number;
    jobDesc: string;
    addTime: Date;
    updateTime: Date;
    author: string;
    alarmEmail?: any;
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
} & Partial<API.JobInfo>;

export type CreateFormProps = {
  onCancel: (flag?: boolean, formVals?: CreateFormValueType) => void;
  onSubmit: (values: CreateFormValueType) => Promise<void>;
  createModalVisible: boolean;
  handleModalVisible: boolean;
  values: Partial<API.JobInfo>;
};

const JobCreateForm: React.FC<CreateFormProps> = (props) => {
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
        id: 'pages.jobManager.createForm.createJob',
        defaultMessage: '新建任务',
      })}
      width="400px"
      visible={props.createModalVisible}
      onVisibleChange={props.handleModalVisible}
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
                id="pages.jobManager.jobGroup"
                defaultMessage="请输入服务Id"
              />
            ),
          },
        ]}
        width="md"
        name="jobGroup"
        placeholder="请输入服务Id"
        label="服务ID"
        initialValue={props.values.jobGroup}
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.jobManager.jobDesc"
                defaultMessage="请输入任务名称"
              />
            ),
          },
        ]}
        initialValue={props.values.jobDesc}
        width="md" name="jobDesc" placeholder="请输入服务名称" label="任务名"/>
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.jobManager.author"
                defaultMessage="负责人"
              />
            ),
          },
        ]}
        initialValue={props.values.author}
        width="md" name="author" placeholder="请输入货拉拉通行证" label="负责人"/>
      <ProFormSelect
        initialValue={props.values.alarm}
        width="md" name="alarm" label="是否报警" options={[
        {
        label: '是',
        value: 1,
        },
        {
          label: '否',
          value: 0,
        },
      ]}/>

    <ProFormSelect
        initialValue={props.values.scheduleType}
        width="md" name="scheduleType" label="调度类型" options={[
        {
        label: 'CRON',
        value: 'CRON',
        },
        {
          label: '固定速度',
          value: 'FIX_RATE',
        },
      ]}/>

    <ProFormText
            rules={[
            {
                required: true,
                message: (
                <FormattedMessage
                    id="pages.jobManager.JobHandler"
                    defaultMessage="JobHandler"
                />
                ),
            },
            ]}
            initialValue={props.values.scheduleConf}
            width="md" name="scheduleConf" placeholder="请输入JobHandler" label="JobHandler"/>
      
      <ProFormSelect
        initialValue={props.values.executorHandler}
        width="md" name="scheduleType" label="调度类型" options={[
        {
        label: 'CRON',
        value: 'CRON',
        },
        {
          label: '固定速度',
          value: 'FIX_RATE',
        },
      ]}/>
      
      <ProFormTextArea
        name="executorParam"
        initialValue={props.values.executorParam}
        width="md" placeholder="请输入任务参数" label="任务参数"
      />
    </ModalForm>
  );
};

export default JobCreateForm;
