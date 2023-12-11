import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormDigit,
  ProFormMoney,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { addGoods, removeGoods, updateGoods, getGoods } from '@/services/ant-design-pro/goods';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.GoodsListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addGoods({ ...fields, created_by_userid: 0 });
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
    await updateGoods({
      id: fields.id,
      goods_name: fields.goods_name,
      shop: fields.shop,
      commission_fixed: fields?.commission_fixed,
      commission_rate: fields?.commission_rate,
      price: fields?.price,
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
 * @param goods_id
 */
const handleRemove = async (goods_id: number) => {
  const hide = message.loading('正在删除');
  if (!goods_id) return true;
  console.log('goods_id', goods_id)
  try {
    await removeGoods(goods_id);
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
  const [currentRow, setCurrentRow] = useState<API.GoodsListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.GoodsListItem[]>([]);

  const restFormRef = useRef(null)
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.GoodsListItem>[] = [
    {
      title: '店铺名称',
      dataIndex: 'shop',
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
      }
    },
    {
      title: "商品名称",
      dataIndex: 'goods_name',
    },
    {
      title: "提成比例(%)",
      dataIndex: 'commission_rate',
      valueType: "percent",
      render: (dom, entity) => {
        return <>{typeof entity.commission_rate === 'number' ? (entity.commission_rate * 100).toFixed(2) : '-'}</>;
      },
      hideInSearch: true
    },
    {
      title: '最小提成比例',
      tooltip: '输入小数0-1，不可大于最大提成比例',
      dataIndex: 'gte_commission_rate',
      valueType: "percent",
      hideInTable: true,
      fieldProps: { precision: 2, step: 0.1, max: 1, min: 0 }
    },
    {
      title: '最大提成比例',
      tooltip: '输入小数0-1，不可小于最小提成比例',
      dataIndex: 'lte_commission_rate',
      valueType: "percent",
      hideInTable: true,
      fieldProps: { precision: 2, step: 0.1, max: 1, min: 0 }
    },
    {
      title: <FormattedMessage id="pages.goods.commission_fixed" defaultMessage="固定佣金" />,
      dataIndex: 'commission_fixed',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: <FormattedMessage id="pages.goods.price" defaultMessage="价格" />,
      dataIndex: 'price',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: <FormattedMessage id="pages.goods.option" defaultMessage="操作" />,
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
      <ProTable<API.GoodsListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.goods.title',
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
            <PlusOutlined /> <FormattedMessage id="pages.goods.add" defaultMessage="新增" />
          </Button>,
        ]}
        request={getGoods}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => {
        //     setSelectedRows(selectedRows);
        //   },
        // }}
      />
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.goods.createForm.goods',
          defaultMessage: '新增',
        })}
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        formRef={restFormRef}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.GoodsListItem);
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
                  id="pages.goods.shop"
                  defaultMessage="店铺名称必须输入"
                />
              ),
            },
          ]}
          width="md"
          name="shop"
          label="店铺名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.goods.goods_name"
                  defaultMessage="商品名称必须输入"
                />
              ),
            },
          ]}
          width="md"
          name="goods_name"
          label="商品名称"
        />
        <ProFormDigit
          label="提成比例"
          name="commission_rate"
          min={0}
          max={1}
          fieldProps={{ precision: 2, step: 0.1 }}
        />
        <ProFormText
          width="md"
          name="commission_fixed"
          label="固定佣金"
        />
        <ProFormMoney
          min={0}
          width="md"
          name="price"
          label="价格"
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
          <ProDescriptions<API.GoodsListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.GoodsListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
