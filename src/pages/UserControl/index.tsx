import { addUser, getUsers, removeUser, updateUser } from '@/services/ant-design-pro/userControl';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useAccess, useRequest } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { getCooperators } from '@/services/ant-design-pro/cooperator';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.UserListItem) => {
  const hide = message.loading('正在添加');
  console.log(fields);
  const { _password, _username } = fields;
  delete fields._password;
  try {
    await addUser({ ...fields, username: _username, password: _password });
    hide();
    message.success('添加成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateUser({
      id: fields.id,
      username: fields.username,
      is_active: fields.is_active,
      is_superuser: fields.is_superuser,
      is_admin: fields.is_admin,
      password: fields.password
    });
    hide();

    message.success('编辑成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param user_id
 */
const handleRemove = async (user_id: number) => {
  const hide = message.loading('正在删除');
  if (!user_id) return true;
  console.log('user_id', user_id);
  try {
    await removeUser(user_id);
    hide();
    message.success('删除成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();
  const { accountEdit } = useAccess();
  const restFormRef = useRef(null);

  const { data: cooperatorList } = useRequest(() => getCooperators({ current: 1, pageSize: 9999 }));
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: "账号名",
      dataIndex: 'username',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: "邮箱",
      dataIndex: 'email',
      valueType: 'text',
    },
    {
      title: "关联联创公司",
      dataIndex: 'cooperator_name',
      valueType: 'text',
    },
    ...(accountEdit
      ? [
          {
            title: "是否管理员",
            dataIndex: 'is_admin',
            render: (_, entity) => {
              return (
                <span
                >
                  {entity.is_admin ? '是' : '否'}
                </span>
              );
            },
          },
          {
            title: "是否激活",
            dataIndex: 'is_active',
            render: (_, entity) => {
              return (
                <span
                >
                  {entity.is_active ? '是' : '否'}
                </span>
              );
            },
          },
        ]
      : []),
    {
      title: "创建时间",
      hideInSearch: true,
      valueType: 'dateTime',
      dataIndex: 'created_timestamp',
    },
    {
      title: "修改时间",
      hideInSearch: true,
      valueType: 'dateTime',
      dataIndex: 'modified_timestamp',
    },
    {
      title: "操作",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        if (!accountEdit) return '';
        return [
          <a
            key="config"
            onClick={() => {
              handleUpdateModalOpen(true);
              setCurrentRow(record);
            }}
          >
            编辑
          </a>,
          // eslint-disable-next-line react/jsx-key
          <Popconfirm
            title="删除用户"
            description="删除后不可恢复，确认删除?"
            onConfirm={async () => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              record.id && (await handleRemove(record.id));
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>,
        ];
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserListItem, API.PageParams>
        headerTitle={"账号管理"}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => {
          if (!accountEdit) return false;
          return [
            <Button
              type="primary"
              key="primary"
              onClick={() => {
                handleModalOpen(true);
              }}
            >
              <PlusOutlined /> 新增
            </Button>,
          ];
        }}
        request={getUsers}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title={'新增'}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        formRef={restFormRef}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.UserListItem);
          if (success) {
            if (restFormRef.current) {
              restFormRef.current.resetFields();
            }
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }

          return true;
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: "账号必须输入",
            },
          ]}
          width="md"
          name="_username"
          label="账号"
        />

        <ProFormText
          rules={[
            {
              type: 'email',
              message: '请输入正确的邮箱格式!',
            },
            {
              required: true,
              message: "邮箱必须输入",
            },
          ]}
          width="md"
          name="email"
          label="邮箱"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: "密码必须输入",
            },
          ]}
          width="md"
          name="_password"
          label="密码"
        />
        <ProFormSelect
          name="cooperator_id"
          label="联创公司"
          width="md"
          rules={[
            {
              required: true,
              message: "联创公司必须选择",
            },
          ]}
          fieldProps={{
            showSearch:  true,
            filterOption: (inputValue, option) => {
              return (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase()) || (option?.value ?? '')?.toString().includes(inputValue.toLowerCase())
            }
          }}
  
          options={cooperatorList?.map(_ => ({
            label: _.name,
            value: _.id
          }))}
          
          placeholder="请选择一个联创公司关联"
          rules={[{ required: true, message: '请选择一个联创公司关联' }]}
        />
      </ModalForm>
      {updateModalOpen && (
        <UpdateForm
          cooperatorList={cooperatorList}
          onSubmit={async (value) => {
            const success = await handleUpdate({ ...currentRow, ...value });
            console.log(currentRow,value)
            if (success) {
              handleUpdateModalOpen(false);
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalOpen(false);
            if (!showDetail) {
              setCurrentRow(undefined);
            }
          }}
          updateModalOpen={updateModalOpen}
          values={currentRow || {}}
        />
      )}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.username && (
          <ProDescriptions<API.UserListItem>
            column={2}
            title={currentRow?.username}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.username,
            }}
            columns={columns as ProDescriptionsItemProps<API.UserListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
