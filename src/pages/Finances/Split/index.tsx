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

const TableList: React.FC = () => {
  const reportDate = useRef({ start_date: '', end_date: '' });

  const { data } = useRequest(() => getGoodsOrderStatus());
  const [order_status_check, set_order_status_check] = useState('');

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
            onChange={(_, dateStrings: [string, string]) => {
              const [start_date, end_date] = dateStrings;
              reportDate.current = { start_date, end_date };
            }}
          />
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => {
              const { start_date, end_date } = reportDate.current;
              if (!start_date || !end_date) return message.warning('时间范围未选择');
              if (isEmpty(order_status_check) || !order_status_check) return message.warning('订单状态未选择')
              downloadPost(
                '/api/v1/tools/download/reports',
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
    </PageContainer>
  );
};

export default TableList;
