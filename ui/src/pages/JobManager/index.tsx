import { PlusOutlined ,UserOutlined,DownOutlined,QuestionCircleOutlined,DeleteTwoTone,EditTwoTone,CopyrightTwoTone,CopyTwoTone
,StopOutlined,StarOutlined,SearchOutlined,ScanOutlined} from '@ant-design/icons';
import { Button, message, Input, Drawer,Menu, Dropdown,Popconfirm,Tooltip} from 'antd';
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
import { jobList,addJob,update,remove,start,stop,trigger,nextTriggerTime ,registerInfo} from '@/services/ant-design-pro/jobApi';



/**
 * 添加节点
 *
 * @param fields
 */


 const handleJob = async (fields: API.Job) => {

  try {

    if(fields.id){
      return handleUpdate(fields);
    }else{

      return handleAdd(fields);
    }

  } catch (error) {
    return false;
  }
};
const handleAdd = async (fields: API.Job) => {
  const hide = message.loading('正在添加');
  try {
    await addJob({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！'+error);
    return false;
  }
};

/**
 * 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在更新');
  try {
    await update({...fields});
    hide();

    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！'+error);
    return false;
  }
};

/**
 * 删除节点
 *
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.Job[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await remove({...selectedRows});
    hide();
    message.success('删除成功，即将刷新');
    // if (actionRef.current) {
    //           actionRef.current.reload();
    // }
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};




const JobManager: React.FC = () => {
  /** 新建窗口的弹窗 */
  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [isEdit, handleIsEdit] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showDetailTime, setShowDetailTime] = useState<boolean>(false);

  const [modalRunOnceVisible, handleRunOnceModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.Job>();
  const [jobGroup, setJobGroup] = useState<API.JobGroup[]>([]);
  const [triggerTime, setTriggerTime] = useState<any>([]);
  const [dataCron, setDataCron] = useState([]);


  const menuEditClick = async(selectedRows: API.Job,type:string)=>{
      
      setCurrentRow(selectedRows);
      handleModalVisible(true);
      handleIsEdit(true);

  };

  const menuRunOnceClick = async(fields: API.Job,type:string)=>{

      handleRunOnceModalVisible(true);
      setCurrentRow(fields);
  
  };

  const menuSearchLogClick = async(selectedRows: API.Job,type:string)=>{
      
      
      console.log(selectedRows,type);

  };

  const menuSearchRegisterNodeClick = async(selectedRows: API.Job,type:string)=>{
      
      try {
        const group = await registerInfo({id:selectedRows.jobGroup});
        setShowDetail(true);
        group.type="register";
        setJobGroup(group.content);
        return true;
      } catch (error) {
        message.error('查询失败请重试！'+error);
        return false;
      }

  };

  const menuNextRuntimeClick = async(selectedRows: API.Job,type:string)=>{
      
      try {
        const time = await nextTriggerTime({...selectedRows});
        setShowDetailTime(true);
        time.executorHandler=selectedRows.executorHandler;
        time.jobDesc = selectedRows.jobDesc;
        
        for(var i in time.content){
          time[i] = time.content[i];
        }

        setTriggerTime(time);
      } catch (error) {
        message.error('查询失败请重试！'+error);
        return false;
      }

  };

  const menuRunClick = async(selectedRows: API.Job,type:string)=>{
      
      const hide = message.loading('正在启动');
      try {
        await start({id:selectedRows.id});
        hide();

        message.success('启动完成');
        return true;
      } catch (error) {
        hide();
        message.error('启动失败请重试！'+error);
        return false;
      }

  };
  const menuStopClick = async(selectedRows: API.Job,type:string)=>{
      
      const hide = message.loading('正在停止');
      try {
        await stop({id:selectedRows.id});
        hide();

        message.success('停止触发完成');
        return true;
      } catch (error) {
        hide();
        message.error('停止失败请重试！'+error);
        return false;
      }

  };

  const menuDeleteClick = async(selectedRows: API.Job,type:string)=>{
      
      handleRemove(selectedRows);
  };

  const menuCopyClick = async(selectedRows: API.Job,type:string)=>{
  
      var editValues = {};
      for(var i in selectedRows){
        if(i=='id')
          continue;
        editValues[i]=selectedRows[i];
      }
      
      handleModalVisible(true);
      handleIsEdit(false);
      setCurrentRow(editValues);

  };



  /** 国际化配置 */
  const intl = useIntl();
  const columnsTime=[

    {title:'executorHandler',dataIndex:'executorHandler'},
    
    {
      title:'下次执行时间',dataIndex:'0',
    },{
      title:'下次执行时间',dataIndex:'1',
    },{
      title:'下次执行时间',dataIndex:'2',
    },{
      title:'下次执行时间',dataIndex:'3',
    },{
      title:'下次执行时间',dataIndex:'4',
    },
  ];

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
        2: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.all" defaultMessage="初始" />
          ),
          triggerStatus: -1,
        },
        0: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.stop" defaultMessage="STOP" />
          ),
          triggerStatus: 0,
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="RUNNING" />
          ),
          triggerStatus: 1,
        },
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Dropdown  trigger='click'overlay={
      <Menu >
            <Menu.Item key="runOnce" icon={<UserOutlined />} onClick={()=>menuRunOnceClick(record,"runOnce")}>
              执行一次
            </Menu.Item>
            <Menu.Item key="searchLog" icon={<SearchOutlined />} onClick={()=>menuSearchLogClick(record,"searchLog")}>
              查询日志
            </Menu.Item>
            <Menu.Item key="searchRegisterNode" icon={<SearchOutlined />} onClick={()=>menuSearchRegisterNodeClick(record,"searchLog")}>
              注册节点
            </Menu.Item>
            <Menu.Item key="nextRuntime" icon={<SearchOutlined />} onClick={()=>menuNextRuntimeClick(record,"searchLog")}>
              下次执行时间
            </Menu.Item>
            <Popconfirm id="pages.searchTable.start"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      title= { "确认启动："+record.jobDesc+"任务?"}
                      onConfirm={
                        async () => {
                          menuRunClick(record,"searchLog");
                          actionRef.current?.reloadAndRest?.();
                        }}>
              <Menu.Item key="run" icon={<StarOutlined />}  disabled={record.triggerStatus==1}>
                启动
              </Menu.Item>
            </Popconfirm>
              <Popconfirm id="pages.searchTable.start"
                        icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                        title= { "确认停止："+record.jobDesc+"任务?"}
                        onConfirm={
                          async () => {
                            menuStopClick(record,"searchLog");
                            actionRef.current?.reloadAndRest?.();
                          }}>
              <Menu.Item key="run" icon={<StarOutlined />} disabled={record.triggerStatus!=1}>
                停止
              </Menu.Item>
            </Popconfirm>
            <Menu.Divider/>
            <Menu.Item key="edit" icon={<EditTwoTone />} onClick={()=>menuEditClick(record,"searchLog")}>
              编辑
            </Menu.Item>
            <Popconfirm id="pages.searchTable.deletion"
                      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                      title= { "确认删除"+record.jobDesc+"?"}
                      onConfirm={
                        async () => {
                          menuDeleteClick(record,"searchLog");
                          actionRef.current?.reloadAndRest?.();
                        }}>
  
                <Menu.Item key="delete" icon={<DeleteTwoTone />} >
                  删除
                </Menu.Item>
            </Popconfirm>
            <Menu.Item key="copy" icon={<CopyTwoTone />} onClick={()=>menuCopyClick(record,"searchLog")}>
              复制
            </Menu.Item>
          </Menu>
    }>
          <Button type="primary" itemValue={record} trigger='click'>
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
          id: 'pages.searchTable.job.title',
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
              handleIsEdit(false);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="新建" />
          </Button>,
        ]}
        request={jobList}
        columns={columns}
      />
      {<ModalForm
        title={intl.formatMessage({
          id: 'pages.searchTable.createForm.startOnce',
          defaultMessage: '执行一次',
        })}
        width="400px"
        modalProps={{
            okText: '执行一次',
            destroyOnClose: true,
        }}
   
        onFinish={async (value) => {

          const hide = message.loading('正在触发');
          try {
            await trigger(value);
            hide();
            message.success('触发完成');
            return true;
          } catch (error) {
            hide();
            message.error('触发失败请重试！'+error);
            return false;
          }
          
        }}
        width="50%"
      visible={modalRunOnceVisible}
      onVisibleChange={handleRunOnceModalVisible}
      values = {currentRow || {}}
      >


        <ProFormText
          name="id"
          initialValue={!currentRow?{}:currentRow.id}
          hidden={true}

        />
        <ProFormTextArea
          rules={[
            {
              
              message: (
                <FormattedMessage
                  id="pages.searchTable.taskArgs"
                  defaultMessage="任务参数"
                />
              ),
            },
          ]}
          placeholder="请输入任务参数"
          width="md"
          name="executorParam" label="任务参数"
        />
        <ProFormTextArea rules={[
            {
              
              message: (
                <FormattedMessage
                  id="pages.searchTable.address"
                  defaultMessage="机器地址"
                />
              ),
            },
          ]}
          placeholder="请输入本次执行的机器地址，为空则从服务获取"
          width="md" name="addressList"  label="机器地址"/>
      </ModalForm>}

      <UpdateForm
        onSubmit={async (value) => {
          value.corn = dataCron;
          const success = await handleJob(value);
          if (success) {
            handModalVisible(false);
            setCurrentRow([]);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
          setCurrentRow([]);
        }}
        modalVisible={modalVisible}
        values={currentRow || {}}
        isEdit={isEdit}
        onChange={(e)=>{
          setDataCron(e);
        }}
        dataCron={dataCron}
      />

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setJobGroup([]);
          setShowDetail(false);
        }}
        closable={true}
        title="注册信息"
      >
      <p>应用名称：{jobGroup.appname}</p>
      <p>地址：{jobGroup.addressList}</p>
      <p>注册地址：{jobGroup.registryList}</p>
      
      </Drawer>
      <Drawer
        width={600}
        visible={showDetailTime}
        onClose={() => {
          setTriggerTime([]);
          setShowDetailTime(false);
        }}
        closable={true}
        title="下次执行时间"
      >
      {triggerTime?.executorHandler && (
          <ProDescriptions
            column={1}
            title={''}
            request={async () => ({
              data: triggerTime || {},
            })}
            params={{
              executorHandler: triggerTime?.executorHandler,
              content:triggerTime?.content,
            }}
            columns={columnsTime}
          />
        )}
      
      </Drawer>
    </PageContainer>
  );
};

export default JobManager;
