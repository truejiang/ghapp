import { getGoodsOrderStatus, getGoodsSales } from '@/services/ant-design-pro/goods-sales';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { Drawer } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
import { API } from '@/services/ant-design-pro/typings';

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GoodsListItem>();

  const [columnsStateMap, setColumnsStateMap] = useState<Record<string, ColumnsState>>({
    commission_rate: {
      show: false,
    },
    estimated_revenue: {
      show: false,
    },
    estimated_technical_service_fee: {
      show: false,
    },
    created_by_userid: {
      show: false,
    },
    created_timestamp: {
      show: false,
    },
    settlement_timestamp: {
      show: false,
    },
    order_type: {
      show: false,
    },
  });

  const columns: ProColumns<API.GoodsListItem>[] = [
    {
      title: '商品标题',
      dataIndex: 'goods_name',
      ellipsis: true,
      render: (dom, entity) => {
        return (
          <a
            className="table-link"
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
      hideInSearch: true
    },
    {
      title: '商品ID',
      dataIndex: 'goods_id',
      valueType: 'select',
      ellipsis: true,
      hideInSearch: true,
    },
    {
      title: '店铺名称',
      dataIndex: 'shop',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '付款时间',
      dataIndex: 'payment_timestamp',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '付款时间',
      dataIndex: 'payment_timestamp',
      valueType: 'dateRange',
      ellipsis: true,
      hideInTable: true,
      hideInDescriptions: true
    },
    {
      title: '结算时间',
      dataIndex: 'settlement_timestamp',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '订单编号',
      dataIndex: 'order_number',
      valueType: 'text'
    },
    {
      title: '订单状态',
      dataIndex: 'order_status',
      ellipsis: true,
      valueType: 'select',
      request: async () => {
        const res = await getGoodsOrderStatus();
        return res.data
      },
      fieldProps: {
        mode: 'multiple',
        showSearch: true,
        maxTagCount: 'responsive'
      },
    },
    {
      title: '付款金额',
      dataIndex: 'payment_amount',
      ellipsis: true,
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '订单类型',
      dataIndex: 'order_type',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '提成比例(%)',
      dataIndex: 'commission_rate',
      render: (dom, entity) => {
        return (
          <>{typeof entity.commission_rate === 'number' ? entity.commission_rate * 100 : '-'}</>
        );
      },
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '预估收入',
      dataIndex: 'estimated_revenue',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '预估技术服务费',
      dataIndex: 'estimated_technical_service_fee',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '账号名称',
      dataIndex: 'account_name',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '账号ID',
      dataIndex: 'account_id',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '数据来源',
      dataIndex: 'data_source',
      ellipsis: true,
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '创建人',
      dataIndex: 'created_by_userid',
      ellipsis: true,
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'created_timestamp',
      ellipsis: true,
      hideInSearch: true
    },
  ];

  return (
    <PageContainer>
      
      <ProTable<API.GoodsListItem, API.PageParams>
        headerTitle="商品订单"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 140,
          defaultCollapsed: false,
          showHiddenNum: true
        }}
        toolBarRender={() => []}
        request={getGoodsSales}
        columns={columns}
        columnsState={{
          value: columnsStateMap,
          onChange: setColumnsStateMap,
        }}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.goods_name && (
          <ProDescriptions<API.GoodsListItem>
            column={1}
            title={currentRow?.goods_name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.goods_name,
            }}
            columns={columns as ProDescriptionsItemProps<API.GoodsListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
