import { getAccounts } from '@/services/ant-design-pro/accounts';
import { getCooperators } from '@/services/ant-design-pro/cooperator';
import { addFinance, removeFinance, updateFinance } from '@/services/ant-design-pro/finances';
import { getGoodsOrderStatus } from '@/services/ant-design-pro/goods-sales';
import { downloadPost } from '@/utils/dowload';
import { DownloadOutlined, SmileOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, useIntl, useRequest } from '@umijs/max';
import { Button, DatePicker, Flex, message, Popconfirm, Result, Select, Space } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import { getToken } from '@/utils/indexs';
import { isEmpty } from 'lodash';
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.FinancesListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addFinance({ ...fields, created_by_userid: 0 });
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
    await updateFinance({
      id: fields.id,
      finances_id: fields.finances_id,
      cooperator_id: fields.cooperator_id,
      account_id: fields.account_id,
      split_rate: fields.split_rate,
      remarks: fields?.remarks,
      fixed_charges: fields?.fixed_charges,
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

  const reportDate = useRef({ start_date: '', end_date: '' });

  const { data } = useRequest(() => getGoodsOrderStatus());
  const [order_status_check, set_order_status_check] = useState('');

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.FinancesListItem>[] = [
    {
      title: <FormattedMessage id="pages.finances.cooperator_id" defaultMessage="联创信息" />,
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
      },
    },
    {
      title: <FormattedMessage id="pages.finances.account_id" defaultMessage="账号名称" />,
      dataIndex: 'account_id',
      render: (dom, entity) => {
        return (
          <>{getLabelById(accountList as any[], entity.account_id, 'account_name', 'account_id')}</>
        );
      },
    },
    {
      title: <FormattedMessage id="pages.finances.split_rate" defaultMessage="分红比例" />,
      dataIndex: 'split_rate',
      // valueType: 'text',
      render: (dom, entity) => {
        return <>{entity.split_rate}%</>;
      },
    },
    {
      title: <FormattedMessage id="pages.finances.fixed_charges" defaultMessage="固定分红" />,
      dataIndex: 'fixed_charges',
      valueType: 'text',
    },
    {
      title: <FormattedMessage id="pages.finances.remarks" defaultMessage="固定分红" />,
      dataIndex: 'remarks',
      valueType: 'text',
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
      <Flex justify="flex-end" align="center" style={{ marginBottom: '12px' }}>
        <Space>
          <Select
            mode="multiple"
            placeholder="请选择订单状态"
            style={{ width: 200 }}
            onChange={set_order_status_check}
            options={data}
            maxTagCount={1}
          />
          <DatePicker.RangePicker
            onChange={(dates: [any, any], dateStrings: [string, string]) => {
              const [start_date, end_date] = dateStrings;
              reportDate.current = { start_date, end_date };
            }}
          />
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => {
              // if(reportDate.)
              const { start_date, end_date } = reportDate.current;
              if (!start_date || !end_date) return message.warning('时间范围未选择');
              if (isEmpty(order_status_check) || !order_status_check) return message.warning('订单状态未选择')
              downloadPost(
                '/api/v1/finances/report/download',
                { ...reportDate.current, order_status_check },
                `分账报告 ${start_date}-${end_date}`,
                { 'Content-Type': 'application/json', Authorization: getToken() },
              );
            }}
          >
            下载
          </Button>
        </Space>
      </Flex>
      <Result icon={<SmileOutlined />} title="可视化报告正在路上，敬请期待!" />
      {/* <ProTable<API.FinancesListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.finances.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={false}
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
          const success = await handleAdd(value as API.FinancesListItem);
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
          request={async () => {
            const res = await getCooperators({});

            return (
              res.data?.map((_) => ({
                label: _.name,
                value: _.cooperator_id,
              })) || []
            );
          }}
          placeholder="请选择一个联创信息"
          rules={[{ required: true, message: '请选择联创信息' }]}
        />
        <ProFormSelect
          name="account_id"
          label="账号"
          request={async () => {
            const res = await getAccounts({});

            return (
              res.data?.map((_) => ({
                label: _.account_name,
                value: _.account_id,
              })) || []
            );
          }}
          placeholder="请选择联一个账号"
          rules={[{ required: true, message: '请选择联一个账号' }]}
        />
        <ProFormDigit
          label="分红比例(%)"
          name="split_rate"
          min={0}
          max={100}
          fieldProps={{ precision: 2, step: 0.1 }}
        />
        <ProFormDigit label="固定分红" name="fixed_charges" min={0} fieldProps={{ precision: 2, step: 0.1 }} />
        <ProFormTextArea name="remarks" label="备注" placeholder="请输入备注" />
      </ModalForm>
      {updateModalOpen && (
        <UpdateForm
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
      </Drawer> */}
    </PageContainer>
  );
};

export default TableList;
