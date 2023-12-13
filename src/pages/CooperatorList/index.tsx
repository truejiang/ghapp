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
import { addCooperator, removeCooperator, updateCooperator, getCooperators } from '@/services/ant-design-pro/cooperator';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.CooperatorListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addCooperator({ ...fields, created_by_userid: 0 });
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
    await updateCooperator({
      id: fields.id,
      name: fields.name,
      founder: fields.founder,
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
 * @param cooperator_id
 */
const handleRemove = async (cooperator_id: number) => {
  const hide = message.loading('正在删除');
  if (!cooperator_id) return true;
  console.log('cooperator_id', cooperator_id)
  try {
    await removeCooperator(cooperator_id);
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
  const [currentRow, setCurrentRow] = useState<API.CooperatorListItem>();

  const restFormRef = useRef(null)
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.CooperatorListItem>[] = [
    {
      title: (
        <FormattedMessage
          id="pages.cooperatorList.name"
          defaultMessage="联创公司"
        />
      ),
      dataIndex: 'name',
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
      title: <FormattedMessage id="pages.cooperatorList.founder" defaultMessage="创始人" />,
      dataIndex: 'founder',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.cooperatorList.option" defaultMessage="操作" />,
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
          key='del'
          title="删除"
          description="删除后不可恢复，确认删除?"
          onConfirm={async () => {
            const success = record.id && await handleRemove(record.id)
            if (success) {
              if (actionRef.current) {
                actionRef.current.reload();
              }
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
      <ProTable<API.CooperatorListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.cooperatorList.title',
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
            <PlusOutlined /> <FormattedMessage id="pages.cooperatorList.add" defaultMessage="新增" />
          </Button>,
        ]}
        request={getCooperators}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.cooperatorList.createForm.cooperatorList',
          defaultMessage: '新增',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        formRef={restFormRef}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.CooperatorListItem);
          if (success) {
            if (restFormRef.current) {
              restFormRef.current.resetFields()
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
                  id="pages.cooperatorList.name"
                  defaultMessage="联创公司必须输入"
                />
              ),
            },
          ]}
          width="md"
          name="name"
          label="联创公司"
        />
        <ProFormText
          width="md"
          name="founder"
          label="创始人"
        />
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
        {currentRow?.name && (
          <ProDescriptions<API.CooperatorListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.CooperatorListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
