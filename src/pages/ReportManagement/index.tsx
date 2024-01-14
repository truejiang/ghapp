import { getCooperators } from '@/services/ant-design-pro/cooperator';
import { getTemplateOptions } from '@/services/ant-design-pro/goods';
import { getGoodsOrderStatus } from '@/services/ant-design-pro/goods-sales';
import { getOptionsOrderStatusCheck } from '@/services/ant-design-pro/reportManagment';
import { downloadPost } from '@/utils/dowload';
import { getToken } from '@/utils/indexs';
import { DownloadOutlined } from '@ant-design/icons';
import { CheckCard, PageContainer } from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, DatePicker, Flex, Form, message, Select, Space, Tour } from 'antd';
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

  const { data: cooperatorList } = useRequest(() => getCooperators({ current: 1, pageSize: 9999 }));

  const [form] = Form.useForm();

  const reportDate = useRef({ start_date: '', end_date: '' });

  const { data } = useRequest(() => getGoodsOrderStatus());
  const { data: options } = useRequest(() => getOptionsOrderStatusCheck());
  const [loading, setLoading] = useState<boolean>(false);
  const [cooperator_id_check, set_cooperator_id_check] = useState([]);
  const { data: templateOptions } = useRequest(() => getTemplateOptions());

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
      <div ref={ref2}>
        <Form layout="inline" form={form}>
          <Flex style={{ marginBottom: '12px' }}>
            <Space>
              <Form.Item label="平台来源" name="data_source">
                <Select
                  placeholder="请求选择平台"
                  style={{ width: 265 }}
                  onChange={() => {
                    form.setFieldValue('order_status_check', []);
                    form.setFieldValue('cooperator_id_check', []);
                    form.setFieldValue('dateRage', []);
                  }}
                  options={templateOptions?.filter((_) => _.label?.startsWith('商品订单'))}
                />
              </Form.Item>
              <Form.Item label="订单状态" name="order_status_check">
                <Select
                  mode="multiple"
                  placeholder="请选择订单状态"
                  style={{ width: 265 }}
                  options={data}
                  maxTagCount={1}
                />
              </Form.Item>
              <Form.Item label="联创公司" name="cooperator_id_check">
                <Select
                  mode="multiple"
                  placeholder="请选择联创公司"
                  style={{ width: 265 }}
                  // onChange={set_cooperator_id_check}
                  options={cooperatorList?.map((_) => ({
                    label: _.name,
                    value: _.id,
                  }))}
                  filterOption={filterOption}
                  maxTagCount={1}
                />
              </Form.Item>
            </Space>
          </Flex>
          <Flex style={{ marginBottom: '12px' }}>
            <Space>
              <Form.Item label="时间范围" name="dateRage">
                <DatePicker.RangePicker
                  onChange={(dates: [any, any], dateStrings: [string, string]) => {
                    const [start_date, end_date] = dateStrings;
                    reportDate.current = { start_date, end_date };
                  }}
                />
              </Form.Item>
            </Space>
          </Flex>
        </Form>
      </div>
      <Flex align="center" style={{ marginBottom: '12px' }}>
        <Space>
          <Button
            loading={loading}
            ref={ref3}
            icon={<DownloadOutlined />}
            type="primary"
            onClick={async () => {
              const formValues = form.getFieldsValue();
              const { order_status_check, data_source, cooperator_id_check } = formValues;
              const { start_date, end_date } = reportDate.current;
              if (!start_date || !end_date) return message.warning('时间范围未选择');
              // if(reportDate.)
              if (isEmpty(order_status_check) || !order_status_check)
                return message.warning('订单状态未选择');
              if(!reportType) return message.warning('请选择一个报告类型');
              setLoading(true);
              if (reportType === '联创分账报告') {
                try {
                  await downloadPost(
                    '/api/v1/tools/download/reports',
                    {
                      ...reportDate.current,
                      data_source,
                      order_status_check,
                      cooperator_id_check,
                      report_name: reportType,
                    },
                    `${reportType} ${start_date}-${end_date}`,
                    { 'Content-Type': 'application/json', Authorization: getToken() },
                  );
                } catch (error) {
                } finally {
                  setLoading(false);
                }
              } else if (reportType === '商品销售日报') {
                try {
                  await downloadPost(
                    '/api/v1/tools/download/reports',
                    {
                      start_date,
                      end_date,
                      data_source,
                      order_status_check,
                      report_name: reportType,
                      cooperator_id_check,
                    },
                    `${reportType} ${start_date}-${end_date}`,
                    { 'Content-Type': 'application/json', Authorization: getToken() },
                  );
                } catch (error) {} finally {
                  setLoading(false);
                }
              }
            }}
          >
            下载
          </Button>
          <Button type="primary" onClick={() => setOpen(true)}>
            操作指引
          </Button>
        </Space>
      </Flex>
      <Flex ref={ref1} style={{ marginTop: '20px' }}>
        <Space>
          <CheckCard.Group
            onChange={(value) => {
              if (typeof value === 'string') {
                if (value === '联创分账报告') {
                  form.setFieldValue('data_source', '商品订单-供应链');
                  
                } else if (value === '商品销售日报') {
                  form.setFieldValue('data_source', '商品订单-抖老板');
                }
                
                setReportType(value);
              } else {
                form.setFieldValue('data_source', []);
              }
              form.setFieldValue('order_status_check', []);
              form.setFieldValue('cooperator_id_check', []);
              form.setFieldValue('dateRage', []);
            }}
          >
            {options?.map((_) => (
              <CheckCard title={_.label} value={_.value} description={_.description} />
            ))}
          </CheckCard.Group>
        </Space>
      </Flex>
    </PageContainer>
  );
};

export default TableList;
