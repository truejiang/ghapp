import { getAccounts } from '@/services/ant-design-pro/accounts';
import { getCooperators } from '@/services/ant-design-pro/cooperator';
import {
  addFinance,
  getFinances,
  removeFinance,
  updateFinance,
} from '@/services/ant-design-pro/finances';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { uniqBy } from 'lodash';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (
  fields: API.FinancesListItem,
  cooperatorList?: API.CooperatorListItem[],
  accountList?: API.AccountsListItem[],
) => {
  const hide = message.loading('正在添加');

  try {
    await addFinance({
      ...fields,
      cooperator_name: cooperatorList?.find((_) => _.id === fields.cooperator_id)?.name,
      account_name: accountList?.find((_) => _.account_id === fields.account_id)?.account_name,
    });
    hide();
    message.success('添加成功！');
    return true;
  } catch (error) {
    console.log(error);
    hide();
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (
  fields: FormValueType,
  cooperatorList?: API.CooperatorListItem[],
  accountList?: API.AccountsListItem[],
) => {
  const hide = message.loading('Configuring');
  try {
    await updateFinance({
      id: fields.id,
      finances_id: fields.finances_id,
      cooperator_id: fields.cooperator_id,
      cooperator_name: cooperatorList?.find((_) => _.id === fields.cooperator_id)?.name,
      account_id: fields.account_id,
      account_name: accountList?.find((_) => _.account_id === fields.account_id)?.account_name,
      split_rate: fields.split_rate,
      remarks: fields?.remarks,
      fixed_charges: fields?.fixed_charges,
    });
    hide();

    message.success('编辑成功！');
    return true;
  } catch (error) {
    hide();
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param finances_id
 */
const handleRemove = async (finances_id: number) => {
  const hide = message.loading('正在删除');
  if (!finances_id) return true;
  try {
    await removeFinance(finances_id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

// 格式化
const getLabelById = (list: any[], val: any, key: string, idName = 'id') => {
  if (!Array.isArray(list)) return '-';
  return list.find((_) => _[idName] === val)?.[key] || val;
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
  const [currentRow, setCurrentRow] = useState<API.FinancesListItem>();

  const { data: cooperatorList } = useRequest(() => getCooperators({ current: 1, pageSize: 9999 }));
  const { data: accountList } = useRequest(() => getAccounts({ current: 1, pageSize: 9999 }));

  const restFormRef = useRef(null);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.FinancesListItem>[] = [
    {
      title: "联创公司",
      dataIndex: 'cooperator_id',
      render: (dom, entity) => {
        const text = getLabelById(cooperatorList as any[], entity.cooperator_id, 'name', 'id');
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {text}
          </a>
        );
      }
    },
    {
      title: "账号ID",
      dataIndex: 'account_id_check',
      valueType: 'select',
      request: async () => {
        const res = await getAccounts({ current: 1, pageSize: 9999 });
        return (
          uniqBy(res.data, 'account_id')?.map((_) => ({
            label: _.account_id,
            value: _.account_id,
          })) || []
        );
      },
      fieldProps: {
        mode: 'multiple',
        maxTagCount: 'responsive',
        filterOption: (inputValue, option = {}) => {
          console.log("🚀 ~ inputValue:", inputValue,option)
          const {label = '', value = ''} = option
          if(value.includes(inputValue.trim()) || label.includes(inputValue.trim())) return true
          return false
        }
      },
      hideInTable: true
    },
    {
      title: <FormattedMessage id="pages.finances.account_id" defaultMessage="账号名称" />,
      dataIndex: 'account_id',
      render: (dom, entity) => {
        return (
          <>{getLabelById(accountList as any[], entity.account_id, 'account_name', 'account_id')}</>
        );
      },
      valueType: 'text',
    },
    {
      title: '分红比例(%)',
      dataIndex: 'split_rate',
      render: (dom, entity) => {
        return <>{typeof entity.split_rate === 'number' ? entity.split_rate * 100 : '-'}</>;
      },
      hideInSearch: true,
    },
    {
      title: '最小分红比例',
      tooltip: '输入小数0-1，不可大于最大分红比例',
      dataIndex: 'gte_split_rate',
      valueType: "percent",
      hideInTable: true,
      fieldProps: { precision: 2, step: 0.1, max: 1, min: 0 }
    },
    {
      title: '最大分红比例',
      tooltip: '输入小数0-1，不可小于最小分红比例',
      dataIndex: 'lte_split_rate',
      valueType: "percent",
      hideInTable: true,
      fieldProps: { precision: 2, step: 0.1, max: 1, min: 0 }
    },
    {
      title: <FormattedMessage id="pages.finances.fixed_charges" defaultMessage="固定分红" />,
      dataIndex: 'fixed_charges',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: "IP公司",
      dataIndex: 'ip_company',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.finances.remarks" defaultMessage="固定分红" />,
      dataIndex: 'remarks',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: <FormattedMessage id="pages.finances.option" defaultMessage="操作" />,
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
          title="删除"
          key="delete"
          description="删除后不可恢复，确认删除?"
          onConfirm={() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            record.finances_id && handleRemove(record.finances_id);
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
      <ProTable<API.FinancesListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.finances.title',
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
            <PlusOutlined /> <FormattedMessage id="pages.finances.add" defaultMessage="新增" />
          </Button>,
        ]}
        request={getFinances}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.finances.createForm.finances',
          defaultMessage: '新增',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        formRef={restFormRef}
        onFinish={async (value) => {
          const success = await handleAdd(
            value as API.FinancesListItem,
            cooperatorList,
            accountList,
          );
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
        <ProFormSelect
          name="cooperator_id"
          label="联创信息"
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
          
          placeholder="请选择一个联创信息"
          rules={[{ required: true, message: '请选择联创信息' }]}
        />
        <ProFormSelect
          name="account_id"
          label="账号"
          fieldProps={{
            showSearch:  true,
            filterOption: (inputValue, option) => {
              return (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase()) || (option?.value ?? '')?.toString().includes(inputValue.toLowerCase())
            }
          }}
          options={accountList?.map(_ => ({
            label: _.account_name,
            value: _.account_id
          }))}
          placeholder="请选择联一个账号"
          rules={[{ required: true, message: '请选择联一个账号' }]}
        />
        <ProFormDigit
          label="分红比例"
          name="split_rate"
          required
          min={0}
          max={1}
          fieldProps={{ precision: 2, step: 0.1 }}
        />
        <ProFormDigit
          label="固定分红"
          name="fixed_charges"
          min={0}
          fieldProps={{ precision: 2, step: 0.1 }}
        />
        <ProFormTextArea name="remarks" label="备注" placeholder="请输入备注" />
      </ModalForm>
      {updateModalOpen && (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(
              { ...currentRow, ...value },
              cooperatorList,
              accountList,
            );
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
        {currentRow?.cooperator_id && (
          <ProDescriptions<API.FinancesListItem>
            column={2}
            title={currentRow?.cooperator_id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.cooperator_id,
            }}
            columns={columns as ProDescriptionsItemProps<API.FinancesListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
