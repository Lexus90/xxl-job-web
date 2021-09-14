import React ,{useState}from 'react';
import { Modal,Card ,Col, Popover, Row, message,Tooltip ,Input,Dropdown,Form} from 'antd';
import ProForm, {
  ModalForm,
  ProFormDateRangePicker, ProFormRadio, ProFormSelect, ProFormText, ProFormTextArea,
} from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import styles from './style.less';
import Cron from '../../Cron';
import { InfoCircleOutlined, UserOutlined,DeleteTwoTone } from '@ant-design/icons';

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
  modalVisible: boolean;
  handleModalVisible: boolean;
  isEdit: boolean;
  values: Partial<API.AppInfo>;
};

const JobUpdateForm: React.FC<UpdateFormProps> = (props) => {
  
const value ={};

  const intl = useIntl();
  const [data, typeCronFuntion] = useState({'request':true,'corn':true});
  const [dataCron, setDataCron] = useState([]);
  

  const typeCron =(e)=>{
    var propType ;

    if(e=='NONE'){
          typeCronFuntion({'request':false,'corn':true});
    }else if(e=='CRON'){
      typeCronFuntion({'request':true,'corn':true});
    }else{
      typeCronFuntion({'request':true,'corn':false});
    }

    
  };

  const onChange =(e)=>{
console.log(e);

};
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
      width="80%"
      visible={props.modalVisible}
      onVisibleChange={props.handleModalVisible}
      onFinish={props.onSubmit}
      isEdit={props.isEdit}
      modalProps={{
        onCancel: ()=>{
          typeCronFuntion(true,data.corn),
          props.onCancel()},
        destroyOnClose: true,
      }}

    >
      <ProFormText
        name="id"
        initialValue={props.values.id}
        hidden={true}

      />
      <Card title="基础配置" className={styles.card} bordered={false}>
          <Row gutter={16}>
             <Col lg={12} md={24} sm={48}>
                <ProFormText
                  rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.jobGroup"
                            defaultMessage="请输入服务名称"
                          />
                        ),
                      },
                    ]}
                    initialValue={props.values.jobGroup}
                    width="lg" name="jobGroup" placeholder="请输入服务名称" label="服务名称"/>
             </Col>
             <Col lg={12} md={24} sm={48}>
                <ProFormText
                      rules={[
                          {
                            required: true,
                            message: (
                              <FormattedMessage
                                id="pages.searchTable.jobDesc"
                                defaultMessage="请输入任务描述"
                              />
                            ),
                          },
                        ]}
                        initialValue={props.values.jobDesc}
                        layout='horizontal'
                        width="lg" name="jobDesc" placeholder="请输入任务描述" label="任务描述"/>
             </Col>
          </Row>
          <Row gutter={16}>
             <Col lg={12} md={24} sm={48}>
                <ProFormText
                  rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.author"
                            defaultMessage="负责人"
                          />
                        ),
                      },
                    ]}
                    initialValue={props.values.author}
                    width="lg" name="author" placeholder="请输入负责人" label="负责人"/>
             </Col>
             <Col lg={12} md={24} sm={48}>
                <ProFormRadio.Group
                      initialValue={!props.values.alarm? 1:props.values.alarm}
                      width="md" name="alarm" label="是否告警" options={[
                      {
                        label: '是',
                        value: 1,
                      },
                      {
                        label: '否',
                        value: 0,
                      },
                ]}/>
             </Col>
          </Row>
      </Card>
      <Card title="调度配置" className={styles.card} bordered={false}>
          <Row gutter={16}>
             <Col lg={12} md={24} sm={48}>
                <ProFormSelect
                  onChange={typeCron}
                  rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.scheduleType"
                            defaultMessage="调度类型"
                          />
                        ),
                      },
                    ]}
                    options={[
                      {
                        label: '无',
                        value: 'NONE',
                      },
                      {
                        label: 'CRON',
                        value: 'CRON',
                      },
                      {
                        label: '固定速度',
                        value: 'FIX_RATE',
                      },
                      {
                        label: '守护进行',
                        value: 'DAEMON',
                      },
                    ]}
                    initialValue={!props.values.scheduleType?'CRON':props.values.scheduleType}
                    width="lg" name="scheduleType" placeholder="调度类型" label="调度类型"/>
             </Col>
             <Col lg={12} md={24} sm={48}>
                {!data.corn&&(<ProFormText
                  rules={[
                      {
                        required: data.request,
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.scheduleConf"
                            defaultMessage="Corn/固定速度"
                          />
                        ),
                      },
                    ]}
                    initialValue={props.values.scheduleConf}
                    width="lg" name="scheduleConf" placeholder="Cron/固定速度数据" label="Corn/固定速度"/>)}

                {data.corn&&(<Dropdown trigger='click'
                    placement="bottomLeft"
                    overlay={<Cron value={value} onOk={props.onChange}/>}
                    >
                  
                    <Form.Item shouldUpdate>
                      {(form) => {
                        return (
                          <ProFormText
                          rules={[
                              {
                                required: data.request,
                                message: (
                                  <FormattedMessage
                                    id="pages.searchTable.scheduleConf"
                                    defaultMessage="Cron表达式"
                                  />
                                ),
                              },
                            ]}
                            value={props.dataCron}
                            width="lg"
                            name="scheduleConf" placeholder="Cron表达式" label="Corn/固定速度"
                          />
                        );
                      }}
                    </Form.Item>

                </Dropdown>)}

             </Col>
          </Row>
          
      </Card>
      <Card title="任务配置" className={styles.card} bordered={false}>
          <Row gutter={16}>
             <Col lg={12} md={24} sm={48}>
                <ProFormSelect
                  
                  rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.glueType"
                            defaultMessage="运行模式"
                          />
                        ),
                      },
                    ]}
                    options={[
                      {
                        label: 'BEAN(java)',
                        value: 'BEAN',
                      },
                      {
                        label: '定时任务(PHP)',
                        value: 'CRON',
                      },
                    ]}
                    disabled={props.isEdit}
                    initialValue={!props.values.glueType?'BEAN':props.values.glueType}
                    width="lg" name="glueType" placeholder="运行模式" label="运行模式"/>
             </Col>
             <Col lg={12} md={24} sm={48}>
                <ProFormText
                  rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.executorHandler"
                            defaultMessage="JobHandler"
                          />
                        ),
                      },
                    ]}
                    suffix={
                        <Tooltip title="Extra information">
                          <InfoCircleOutlined/>
                        </Tooltip>
                      }
                    initialValue={props.values.executorHandler}
                    width="lg" name="executorHandler" placeholder="JobHandler" label="JobHandler"/>
              </Col>        
          </Row>
          <Row gutter={16}>
          <Col lg={20} md={40} sm={90}>
            
            <ProFormTextArea
                name="executorParam"
                initialValue={props.values.executorParam} label="任务参数"
              />
          </Col>
          </Row>
      </Card>
      <Card title="高级配置" className={styles.card} bordered={false}>
          <Row gutter={16}>
             <Col lg={12} md={24} sm={48}>
                <ProFormSelect
                  
                  rules={[
                      {
                        
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.executorRouteStrategy"
                            defaultMessage="路由策略"
                          />
                        ),
                      },
                    ]}
                    options={[
                      {
                        label: '轮询',
                        value: 'ROUND',
                      },
                      {
                        label: '随机',
                        value: 'RANDOM',
                      },
                      {
                        label: '第一个',
                        value: 'FIRST',
                      },
                      {
                        label: '最后一个',
                        value: 'LAST',
                      },
                      {
                        label: '一致性HASH',
                        value: 'CONSISTENT_HASH',
                      },
                      {
                        label: '最不经常使用',
                        value: 'LEAST_FREQUENTLY_USED',
                      },
                      {
                        label: '最近最久未使用',
                        value: 'LEAST_RECENTLY_USED',
                      },
                      {
                        label: '故障转移',
                        value: 'FAILOVER',
                      },
                      {
                        label: '忙碌转移',
                        value: 'BUSYOVER',
                      },
                      {
                        label: '分片广播',
                        value: 'SHARDING_BROADCAST',
                      },
                    ]}
                    initialValue={!props.values.executorRouteStrategy? 'ROUND':props.values.executorRouteStrategy}
                    width="lg" name="executorRouteStrategy" placeholder="请选择路由策略" label="路由策略"/>
             </Col>
             <Col lg={12} md={24} sm={48}>
                <ProFormText
                  rules={[
                      {
                        
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.childJobId"
                            defaultMessage="childJobId"
                          />
                        ),
                      },
                    ]}
                    initialValue={props.values.childJobId}
                    width="lg" name="childJobId" placeholder="请输入子任务ID，如有多个情以,分隔" label="子任务ID"/>
              </Col> 
          </Row>
          <Row gutter={16}>
             <Col lg={12} md={24} sm={48}>
                <ProFormSelect
                  
                  rules={[
                      {
                        
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.misfireStrategy"
                            defaultMessage="请选择调度过期策略"
                          />
                        ),
                      },
                    ]}
                    options={[
                      {
                        label: '忽略',
                        value: 'DO_NOTHING',
                        default: true
                      },
                      {
                        label: '立即执行一次',
                        value: 'FIRE_ONCE_NOW',
                      },
                    ]}
                    initialValue={!props.values.misfireStrategy?'DO_NOTHING':props.values.misfireStrategy}
                    width="lg" name="misfireStrategy" placeholder="请选择调度过期策略" label="调度过期策略"/>
             </Col>
             <Col lg={12} md={24} sm={48}>
                <ProFormSelect
                  
                  rules={[
                      {
                        
                        message: (
                          <FormattedMessage
                            id="pages.searchTable.executorBlockStrategy"
                            defaultMessage="请选择阻塞处理策略"
                          />
                        ),
                      },
                    ]}
                    options={[
                      {
                        label: '单机串行',
                        value: 'SERIAL_EXECUTION',
                      },
                      {
                        label: '丢弃后续调度',
                        value: 'DISCARD_LATER',
                      },
                      {
                        label: '覆盖之前调度',
                        value: 'COVER_EARLY',
                      },
                    ]}
                    initialValue={!props.values.executorBlockStrategy? 'SERIAL_EXECUTION':props.values.executorBlockStrategy}
                    width="lg" name="executorBlockStrategy" placeholder="请选择阻塞处理策略" label="阻塞处理策略"/>
             </Col>
          </Row>
          <Row gutter={16}>
             <Col lg={12} md={24} sm={48}>
                <ProFormText
                  
                    initialValue={!props.values.executorTimeout?0:props.values.executorTimeout}
                    width="lg" name="executorTimeout" placeholder="任务超时时间，单位秒，大于零时生效" label="任务超时时间"/>
              </Col> 
             <Col lg={12} md={24} sm={48}>
                <ProFormText
                    initialValue={!props.values.executorFailRetryCount?0:props.values.executorFailRetryCount}
                    width="lg" name="executorFailRetryCount" placeholder="失败重试次数，大于零时生效" label="失败重试次数"/>
              </Col> 
          </Row>
          
      </Card>
    </ModalForm>
  );
};
export default JobUpdateForm;
