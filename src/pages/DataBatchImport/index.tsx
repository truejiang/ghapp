import { dataBatchImport } from '@/services/ant-design-pro/dataBatchImport';
import { getTemplateOptions } from '@/services/ant-design-pro/goods';
import { CheckCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, request, useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  message,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Tour,
  Upload,
} from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import CountUp from 'react-countup';

const TableList: React.FC = () => {
  const [create_related_data, set_create_related_data] = useState(true);

  const [open, setOpen] = useState<boolean>(false);
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const ref3 = useRef<HTMLButtonElement>(null);

  const steps: TourProps['steps'] = [
    {
      title: '第一步：选择模版类型',
      description: '选择一个需要上传更新的模版，支持抖老板等数据导入，也支持自定义模版',
      target: () => ref1.current!,
    },
    {
      title: '第二步：选择上传文件',
      description: '根据选择的模版类型上传对应的文件，支持多个文件',
      target: () => ref2.current!,
    },
    {
      title: '第三步：点击上传',
      description: '点击上传后开始导入数据，更新的信息会在下面卡片显示。',
      target: () => ref3.current!,
    },
  ];

  const [spinning, setSpinning] = React.useState<boolean>(false);
  const [execute_info, setexecute_info] = React.useState<{
    [key: string]: { exists: number; updated: number; inserted: number };
  }>(false);

  const { data } = useRequest(() => getTemplateOptions());
  const [data_source, set_data_source] = useState('');

  const [file_list, set_file_list] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { run: runDataBatchImport } = useRequest(dataBatchImport, {
    manual: true,
  });
  // useRequest()

  const handleUpload = () => {
    setUploading(true);

    const formData = new FormData();
    file_list.forEach((file) => {
      formData.append('file_list', file as RcFile);
    });

    request('/api/v1/tools/upload/excel_list', {
      method: 'POST',
      data: formData,
      params: {
        data_source,
      },
    })
      .then((res = {}) => {
        const { success, message, failure = [] } = res;
        console.log(success);
        if (!isEmpty(success) && Array.isArray(success)) {
          notification.open({
            message: '更新成功',
            description: (
              <div
                dangerouslySetInnerHTML={{
                  __html: `${message}<br> 本次共更新${success.length}个文件，具体内容如下`,
                }}
              ></div>
            ),
            key: 'error',
            onClose: async () => null,
            icon: <CheckCircleOutlined />,
            placement: 'top',
          });
          // const { records = {} } = response;
          // const { execute_info } = records;

          let summary = {};

          success.forEach((item) => {
            let execute_info = item.records.execute_info;
            for (let key in execute_info) {
              if (!summary[key]) {
                summary[key] = { ...execute_info[key] };
              } else {
                summary[key].inserted += execute_info[key].inserted;
                summary[key].updated += execute_info[key].updated;
                summary[key].exists += execute_info[key].exists;
              }
            }
          });

          setexecute_info(summary);

          set_file_list([]);
        } else {
          notification.open({
            message: '错误提示',
            description: (
              <div
                dangerouslySetInnerHTML={{
                  __html: `${message}<br>失败的文件如下<br><div style="color: #aa0365">${failure.reduce(
                    (curr, prev) => (curr += prev.filename + '<br>'),
                    '',
                  )}</div>`,
                }}
              ></div>
            ),
            key: 'error',
            onClose: async () => null,
            icon: <ExclamationCircleOutlined color="#aa0365" />,
            placement: 'top',
          });
        }
        // message.success('upload successfully.');
      })
      .catch(() => {
        message.error('upload failed.');
      })
      .finally(() => {
        setUploading(false);
      });
  };
  const formatter = (value: number) => <CountUp end={value} separator="," />;

  const jump = (path: string) => {
    history.push(path);
  };

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
      <Flex align="center" style={{ marginBottom: '12px' }}>
        <Space>
          <div ref={ref1}>
            <Select
              placeholder="请求选择平台"
              style={{ width: 180 }}
              onChange={set_data_source}
              options={data}
            />
          </div>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={file_list.length === 0}
            loading={uploading}
            ref={ref3}
          >
            {uploading ? '上传中...' : '开始上传'}
          </Button>
          <Button type="primary" onClick={() => setOpen(true)}>
            操作指引
          </Button>
        </Space>
      </Flex>
      <Flex>
        <Spin spinning={spinning}>
          <Upload
            multiple
            beforeUpload={(file, fileList = []) => {
              console.log(file, fileList);
              set_file_list([...file_list, ...fileList]);
              return false;
            }}
            fileList={file_list}
            onRemove={(file) => {
              const index = file_list.indexOf(file);
              const newFileList = file_list.slice();
              newFileList.splice(index, 1);
              set_file_list(newFileList);
            }}
          >
            <Button ref={ref2} icon={<UploadOutlined />}>
              点击选择文件
            </Button>
          </Upload>
        </Spin>
      </Flex>
      <Divider />
      {isEmpty(execute_info) ? (
        <Empty
          style={{ marginTop: '100px' }}
          description={'暂无更新数据，请在左上角上传后查看！'}
        ></Empty>
      ) : (
        <Row gutter={16}>
          {execute_info?.goods_sales && (
            <Col span={12}>
              <Card
                bordered={false}
                title="商品销售"
                extra={
                  <Button type="link" block onClick={() => jump('/goods/sales')}>
                    去页面查看
                  </Button>
                }
              >
                <Row>
                  <Col span={8}>
                    <Statistic
                      title="现存数量"
                      value={execute_info?.goods_sales?.exists}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="新增数量"
                      value={execute_info?.goods_sales?.inserted}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="更新数量"
                      value={execute_info?.goods_sales?.updated}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                </Row>
                <Row style={{ marginTop: '12px' }}>
                  <Col span={12}>
                    <Statistic
                      title="未找到关联商品佣金"
                      value={10}
                      precision={2}
                      valueStyle={{ color: '#cf1322' }}
                      formatter={formatter}
                      prefix={<InfoCircleOutlined />}
                    />
                  </Col>
                  <Col span={12} >
                  <Statistic
                      title="未找到关联财务分账配置"
                      value={12}
                      precision={2}
                      valueStyle={{ color: '#cf1322' }}
                      formatter={formatter}
                      prefix={<InfoCircleOutlined />}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
          {execute_info?.goods_commission && (
            <Col span={12}>
              <Card
                bordered={false}
                title="商品佣金"
                extra={
                  <Button type="link" block onClick={() => jump('/goods/commission-management')}>
                    去页面查看
                  </Button>
                }
              >
                <Row>
                  <Col span={8}>
                    <Statistic
                      title="现存数量"
                      value={execute_info?.goods_commission?.exists}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="新增数量"
                      value={execute_info?.goods_commission?.inserted}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="更新数量"
                      value={execute_info?.goods_commission?.updated}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
          {execute_info?.account && (
            <Col span={12} style={{ marginTop: '20px' }}>
              <Card
                bordered={false}
                title="账号管理"
                extra={
                  <Button type="link" block onClick={() => jump('/accounts')}>
                    去页面查看
                  </Button>
                }
              >
                <Row>
                  <Col span={8}>
                    <Statistic
                      title="现存数量"
                      value={execute_info?.account?.exists}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="新增数量"
                      value={execute_info?.account?.inserted}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="更新数量"
                      value={execute_info?.account?.updated}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
          {execute_info?.cooperator && (
            <Col span={12} style={{ marginTop: '20px' }}>
              <Card
                bordered={false}
                title="联创公司"
                extra={
                  <Button type="link" block onClick={() => jump('/cooperator-list')}>
                    去页面查看
                  </Button>
                }
              >
                <Row>
                  <Col span={8}>
                    <Statistic
                      title="现存数量"
                      value={execute_info?.cooperator?.exists}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="新增数量"
                      value={execute_info?.cooperator?.inserted}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic
                      title="更新数量"
                      value={execute_info?.cooperator?.updated}
                      precision={2}
                      valueStyle={{ color: '#3f8600' }}
                      formatter={formatter}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
        </Row>
      )}
    </PageContainer>
  );
};

export default TableList;
