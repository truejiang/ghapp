import { dataBatchImport } from '@/services/ant-design-pro/dataBatchImport';
import { getTemplateOptions } from '@/services/ant-design-pro/goods';
import { download, downloadFile } from '@/utils/dowload';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer, ProFormDigit } from '@ant-design/pro-components';
import { history, request, useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Flex,
  FloatButton,
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
import { TourProps } from 'antd/lib/tour/interface';
import { isEmpty } from 'lodash';
import React, { useRef, useState } from 'react';
import CountUp from 'react-countup';
import helpPng from './help.png';
import UpdateTableDialog from './UpdateTableDialog';

const TableList: React.FC = () => {
  const [create_related_data, set_create_related_data] = useState(true);

  const [open, setOpen] = useState<boolean>(false);
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const ref3 = useRef<HTMLButtonElement>(null);
  const ref4 = useRef<HTMLButtonElement>(null);
  const ref5 = useRef<HTMLButtonElement>(null);

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
    {
      title: '第四步：查看结果',
      description:
        '上传成功后下方卡片会更新不同模块的跟新数据，异常未关联数据可点击下载模版修改后重新上传更新。详细信息可参考上图标注。',
      target: () => ref4.current!,
      cover: <img alt="tour.png" src={helpPng} />,
    },
    {
      title: '提示：模版下载',
      description: '如果想主动更新模版可以先在左上角选择模版平台，然后点击右下角按钮下载！',
      target: () => ref5.current!,
    },
  ];

  const [spinning, setSpinning] = React.useState<boolean>(false);
  const [execute_info, setexecute_info] = React.useState<{
    [key: string]: {
      extra: any;
      exists: number;
      updated: number;
      inserted: number;
    };
  }>(false);

  const { data } = useRequest(() => getTemplateOptions());
  const [data_source, set_data_source] = useState('');

  const [file_list, set_file_list] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { run: runDataBatchImport } = useRequest(dataBatchImport, {
    manual: true,
  });

  const [updateModalOpen, setUpdateModalOpen] = useState(false);

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

  const downloadTemp = async () => {
    const template_filename = data.find((_) => _.value === data_source)?.template_filename;
    console.log(template_filename);
    if (!template_filename) {
      return message.warning('在左上角选择模版的平台吧');
    }
    download(
      '/api/v1/goods/templates/download',
      {
        template_filename,
      },
      template_filename,
      'get',
    );
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
      <Flex align="center" justify="space-between">
        <div>
          <Space style={{ marginBottom: '12px' }}>
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
            <Button style={{ marginLeft: 'auto' }} type="primary" onClick={() => setOpen(true)}>
              操作指引
            </Button>
          </Space>
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
        </div>
        <div>
          <ProFormDigit
            label="全佣比例低于时"
            name="commission_rate"
            min={0}
            max={1}
            fieldProps={{ precision: 2, step: 0.1 }}
          />
        </div>
      </Flex>
      <Divider />
      <div ref={ref4}>
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
                  {Array.isArray(execute_info?.goods_sales?.extra) && (
                    <Row style={{ marginTop: '12px' }}>
                      {execute_info?.goods_sales?.extra.map((item) => (
                        <Col span={12}>
                          <Statistic
                            title={item.data_source + '未关联数量'}
                            value={item.maintainable || 0}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            formatter={formatter}
                            prefix={<InfoCircleOutlined />}
                          />
                          <Button
                            danger
                            onClick={() => downloadFile(item.template_file || '')}
                            style={{ marginTop: '10px' }}
                          >
                            下载修改
                          </Button>
                          <Button
                            danger
                            onClick={() => setUpdateModalOpen(true)}
                            style={{ marginTop: '10px', marginLeft: '12px' }}
                          >
                            直接修改
                          </Button>
                        </Col>
                      ))}
                    </Row>
                  )}
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
      </div>
      <div>
        <FloatButton
          onClick={downloadTemp}
          tooltip={
            <div>点击可下载模版，需要先在左上角选择好平台。如有操作问题可以随时联系技术人员</div>
          }
          description={<div ref={ref5}>模版下载</div>}
        />
      </div>

      <UpdateTableDialog
        updateModalOpen={updateModalOpen}
        handleCancel={() => setUpdateModalOpen(false)}
        handleOk={() => setUpdateModalOpen(false)}
      />
    </PageContainer>
  );
};

export default TableList;
