import { getAccounts } from '@/services/ant-design-pro/accounts';
import { getCooperators } from '@/services/ant-design-pro/cooperator';
import { getGoodsOrderStatus } from '@/services/ant-design-pro/goods-sales';
import { getOptionsOrderStatusCheck } from '@/services/ant-design-pro/reportManagment';
import { downloadPost } from '@/utils/dowload';
import { getToken } from '@/utils/indexs';
import { DownloadOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-components';
import { CheckCard, PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, DatePicker, Flex, message, Select, Space } from 'antd';
import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';

// 格式化
const getLabelById = (list: any[], val: any, key: string, idName = 'id') => {
  if (!Array.isArray(list)) return '-';
  return list.find((_) => _[idName] === val)?.[key] || val;
};

function getTody() {
  let currentDate = new Date(); // 创建一个表示当前时间的Date对象

  // 获取当前年份
  let year = currentDate.getFullYear();

  // 获取当前月份（注意JavaScript中月份从0开始计数）
  let month = currentDate.getMonth() + 1;

  // 获取当前日期
  let day = currentDate.getDate();

  return year + '-' + month + '-' + day;
}

function getTomon() {
  let currentDate = new Date(); // 创建一个表示当前时间的Date对象

  // 获取当前年份
  let year = currentDate.getFullYear();
  console.log('当前年份为：' + year);

  // 获取当前月份（注意JavaScript中月份从0开始计数）
  let month = currentDate.getMonth() + 1;
  console.log('当前月份为：' + month);

  // 获取当前日期
  let day = currentDate.getDate();
  console.log('当前日期为：' + day);

  // 获取明天的日期
  currentDate.setDate(day + 1); // 将日期设置为下一天
  year = currentDate.getFullYear();
  month = currentDate.getMonth() + 1;
  day = currentDate.getDate();

  return year + '-' + month + '-' + day;
}

function getNextDay(dateString: string): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();

  // 如果月份和日期小于10，前面补0
  month = month.length < 2 ? '0' + month : month;
  day = day.length < 2 ? '0' + day : day;

  return `${year}-${month}-${day}`;
}

const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
  const [reportType, setReportType] = useState<string>('');

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.FinancesListItem>();

  const { data: cooperatorList } = useRequest(() => getCooperators({ current: 1, pageSize: 9999 }));
  const { data: accountList } = useRequest(() => getAccounts({ current: 1, pageSize: 9999 }));

  const restFormRef = useRef(null);

  const reportDate = useRef({ start_date: '', end_date: '' });

  const { data } = useRequest(() => getGoodsOrderStatus());
  const { data: options } = useRequest(() => getOptionsOrderStatusCheck());
  const [order_status_check, set_order_status_check] = useState('');
  const [cooperator_id_check, set_cooperator_id_check] = useState('');

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
          <Select
            mode="multiple"
            placeholder="请选择联创公司"
            style={{ width: 200 }}
            onChange={set_cooperator_id_check}
            options={cooperatorList?.map(_ => ({
              label: _.name,
              value: _.id
            }))}
            filterOption={filterOption}
            maxTagCount={1}
          />
          
          {reportType === '联创分账报告' && (
            <>
              <DatePicker.RangePicker
                onChange={(dates: [any, any], dateStrings: [string, string]) => {
                  const [start_date, end_date] = dateStrings;
                  reportDate.current = { start_date, end_date };
                }}
              />
            </>
          )}
          {
            reportType === '商品销售日报' && 
            <DatePicker onChange={(date, dateString) => {
              // console.log({date, dateString})
              const start_date = dateString
              const end_date = getNextDay(dateString)
              // const [start_date, end_date] = dateString;
              reportDate.current = { start_date, end_date };
            }} />
          }
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => {
              // if(reportDate.)
              if (isEmpty(order_status_check) || !order_status_check)
                return message.warning('订单状态未选择');
              if(isEmpty(cooperator_id_check) || !order_status_check) return message.warning('未选择联创公司')
              if (reportType === '联创分账报告') {
                const { start_date, end_date } = reportDate.current;
                if (!start_date || !end_date) return message.warning('时间范围未选择');
                downloadPost(
                  '/api/v1/tools/download/reports',
                  { ...reportDate.current, order_status_check, cooperator_id_check,report_name: reportType },
                  `${reportType} ${start_date}-${end_date}`,
                  { 'Content-Type': 'application/json', Authorization: getToken() },
                );
              } else if (reportType === '商品销售日报') {
                const { start_date, end_date } = reportDate.current;
                if (!start_date || !end_date) return message.warning('未选择时间');
                downloadPost(
                  '/api/v1/tools/download/reports',
                  {
                    start_date,
                    end_date,
                    order_status_check,
                    report_name: reportType,
                    cooperator_id_check
                  },
                  `${reportType} ${start_date}`,
                  { 'Content-Type': 'application/json', Authorization: getToken() },
                );
              } else {
                return message.warning('请选择一个报告类型');
              }
            }}
          >
            下载
          </Button>
        </Space>
      </Flex>
      <Flex style={{ marginTop: '20px' }}>
        <Space>
          <CheckCard.Group
            onChange={(value) => {
              if (typeof value === 'string') {
                setReportType(value);
              }
            }}
          >
            {options?.map((_) => (
              <CheckCard title={_.label} value={_.value} />
            ))}
          </CheckCard.Group>
        </Space>
      </Flex>
    </PageContainer>
  );
};

export default TableList;
