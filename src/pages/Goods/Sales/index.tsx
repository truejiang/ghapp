import { getGoodsOrderStatus, getGoodsSales } from '@/services/ant-design-pro/goods-sales';
import { download } from '@/utils/dowload';
import { getToken } from '@/utils/indexs';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import { PageContainer, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
import { Button, Drawer, Flex, message, notification, Select, Space, Spin, Upload } from 'antd';
import React, { useRef, useState } from 'react';
import './index.less';
import { getTemplateOptions } from '@/services/ant-design-pro/goods';

const TableList: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.GoodsListItem>();

  const [data_source, set_data_source] = useState('');
  const [create_related_data, set_create_related_data] = useState(true);

  const [spinning, setSpinning] = React.useState<boolean>(false);

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

  const { data } = useRequest(() => getTemplateOptions())
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

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
      valueType: 'date',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '付款时间',
      dataIndex: 'payment_timestamp',
      valueType: 'dateRange',
      ellipsis: true,
      hideInTable: true
    },
    {
      title: '结算时间',
      dataIndex: 'settlement_timestamp',
      valueType: 'date',
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
      title: '抖音号名称(备注)',
      dataIndex: 'account_name',
      valueType: 'text',
      ellipsis: true,
    },
    {
      title: '抖音ID',
      dataIndex: 'account_id',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '抖音UID',
      dataIndex: 'account_uid',
      valueType: 'text',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '运营人',
      dataIndex: 'operator',
      ellipsis: true,
      valueType: 'text',
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
      valueType: 'date',
      hideInSearch: true
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
