import {
  addAccount,
  getAccounts,
  removeAccount,
  updateAccount,
} from '@/services/ant-design-pro/accounts';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.AccountsListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addAccount({ ...fields, user_id: 0, created_by_userid: 0 });
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
    await updateAccount({
      account_id: fields.account_id,
      account_name: fields.account_name,
      platform: fields.platform,
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
 * @param account_id
 */
const handleRemove = async (account_id: number) => {
  const hide = message.loading('正在删除');
  if (!account_id) return true;
  console.log('account_id', account_id);
  try {
    await removeAccount(account_id);
    hide();
    message.success('删除成功');
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
  const [currentRow, setCurrentRow] = useState<API.AccountsListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.AccountsListItem[]>([]);

  const restFormRef = useRef(null);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.AccountsListItem>[] = [
    {
      title: <FormattedMessage id="pages.accounts.account_id" defaultMessage="账号ID" />,
      dataIndex: 'account_id',
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
      title: <FormattedMessage id="pages.accounts.account_name" defaultMessage="账户名称" />,
      dataIndex: 'account_name',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.accounts.platform" defaultMessage="平台名称" />,
      dataIndex: 'platform',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: <FormattedMessage id="pages.accounts.option" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.update" defaultMessage="编辑" />
        </a>,
        <Popconfirm
          key="delete"
          title="删除"
          description="删除后不可恢复，确认删除?"
          onConfirm={() => {
            if (record.account_id) {
              handleRemove(record.account_id);
            }
          }}
          okText="确认"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.AccountsListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.accounts.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 140,
          defaultCollapsed: false,
showHiddenNum: true
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.accounts.add" defaultMessage="新增" />
          </Button>,
        ]}
        request={getAccounts}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.accounts.createForm.accounts',
          defaultMessage: '新增',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        formRef={restFormRef}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.AccountsListItem);
          if (success) {
            if (restFormRef.current) {
              restFormRef.current.resetFields();
            }
            handleModalOpen(false);
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
                  id="pages.accounts.account_id"
                  defaultMessage="账号ID必须输入"
                />
              ),
            },
          ]}
          width="md"
          name="account_id"
          label="账户名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.accounts.account_name"
                  defaultMessage="账户名称必须输入"
                />
              ),
            },
          ]}
          width="md"
          name="account_name"
          label="账户名称"
        />
        <ProFormText width="md" name="platform" label="平台" />
      </ModalForm>
      {updateModalOpen && <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate({ ...currentRow, ...value });
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
      />}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.account_name && (
          <ProDescriptions<API.AccountsListItem>
            column={2}
            title={currentRow?.account_name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.account_name,
            }}
            columns={columns as ProDescriptionsItemProps<API.AccountsListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
