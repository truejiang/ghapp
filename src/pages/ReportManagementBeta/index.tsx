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
import { Button, DatePicker, Flex, message, Select, Space, Tour } from 'antd';
import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';

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
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [reportType, setReportType] = useState<string>('');

  const actionRef = useRef<ActionType>();

  const { data: cooperatorList } = useRequest(() => getCooperators({ current: 1, pageSize: 9999 }));
  const { data: accountList } = useRequest(() => getAccounts({ current: 1, pageSize: 9999 }));

  const restFormRef = useRef(null);

  const reportDate = useRef({ start_date: '', end_date: '' });

  const { data } = useRequest(() => getGoodsOrderStatus());
  const { data: options } = useRequest(() => getOptionsOrderStatusCheck());
  const [order_status_check, set_order_status_check] = useState('');
  const [cooperator_id_check, set_cooperator_id_check] = useState([]);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const [open, setOpen] = useState(false);
  const steps = [
    {
      title: '第一步：选择下载报告的类型',
      description: '可以通过阅读描述信息了解注意事项',
      target: () => ref1.current,
    },
    {
      title: '第二步：选择筛选项',
      description: '日报选择多天通过sheet分隔',
      target: () => ref2.current,
    },
    {
      title: '第三步：点击下载报告',
      description: '下载到本地后可以查看详情内容',
      target: () => ref3.current,
    },
  ];
  
  return (
    <PageContainer>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span>
            {current + 1} / {total}
          </span>
        )}
      />
      <Flex justify="flex-end" align="center" style={{ marginBottom: '12px' }}>
        <Space>
          <div ref={ref2}>
            <Select
              mode="multiple"
              placeholder="请选择订单状态"
              style={{ width: 200, marginRight: '12px' }}
              onChange={set_order_status_check}
              options={data}
              maxTagCount={1}
            />
            <Select
              mode="multiple"
              placeholder="请选择联创公司"
              style={{ width: 200, marginRight: '12px' }}
              onChange={set_cooperator_id_check}
              options={cooperatorList?.map(_ => ({
                label: _.name,
                value: _.id
              }))}
              filterOption={filterOption}
              maxTagCount={1}
            />
            
            <DatePicker.RangePicker
              onChange={(dates: [any, any], dateStrings: [string, string]) => {
                const [start_date, end_date] = dateStrings;
                reportDate.current = { start_date, end_date };
              }}
            />
          </div>
          <Button
            ref={ref3}
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => {
              // if(reportDate.)
              if (isEmpty(order_status_check) || !order_status_check)
                return message.warning('订单状态未选择');
              // if(reportType === '联创分账报告' && (isEmpty(cooperator_id_check) || !order_status_check)) return message.warning('未选择联创公司')
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
                  `${reportType} ${start_date}-${end_date}`,
                  { 'Content-Type': 'application/json', Authorization: getToken() },
                );
              } else {
                return message.warning('请选择一个报告类型');
              }
            }}
          >
            下载
          </Button>
          <Button
            type="primary"
            onClick={() => setOpen(true)}
            style={{marginLeft: 'auto'}}
          >
            操作指引
          </Button>
        </Space>
      </Flex>
      <Flex ref={ref1} style={{ marginTop: '20px' }}>
        <Space>
          <CheckCard.Group
            onChange={(value) => {
              if (typeof value === 'string') {
                setReportType(value);
              }
            }}
            
          >
            {(options?.concat([{
              label: '综合报表',
              value: '综合报表',
              description: '避免联创无关联数据，使用日报数据兜底，综合展示，仅供参考。后期也可以自己搭配不同数据生产报表。'
            }]))?.map((_) => (
              <CheckCard title={_.label} value={_.value} description={_.description}/>
            ))}
          </CheckCard.Group>
        </Space>
      </Flex>
    </PageContainer>
  );
};

export default TableList;