import { dataBatchImport } from '@/services/ant-design-pro/dataBatchImport';
import { getTemplateOptions } from '@/services/ant-design-pro/goods';
import { download } from '@/utils/dowload';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history, useRequest } from '@umijs/max';
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
  Upload,
} from 'antd';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import CountUp from 'react-countup';


const TableList: React.FC = () => {
  const [create_related_data, set_create_related_data] = useState(true);

  const [spinning, setSpinning] = React.useState<boolean>(false);
  const [execute_info, setexecute_info] = React.useState<{
    [key: string]: { exists: number; updated: number; inserted: number };
  }>(false);

  const { data } = useRequest(() => getTemplateOptions());
  const [data_source, set_data_source] = useState('');

  const [file_list, set_file_list] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { run: runDataBatchImport } = useRequest(dataBatchImport, {
    manual: true
  })
  // useRequest()

  const handleUpload = () => {
    setUploading(true);
    runDataBatchImport({
      data_source,
      file_list
    }).then(() => {
        set_file_list([]);
        message.success('upload successfully.');
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
      <Flex align="center" style={{ marginBottom: '12px' }}>
        <Space>
          <Button
            icon={<FileExcelOutlined />}
            onClick={() => {
              const template_filename = data.find(
                (_: { label: any }) => _.label === data_source,
              )?.template_filename;
              if (!data_source) return message.error('请选择需下载模板的平台！');
              download(
                '/api/v1/tools/download/templates',
                {
                  template_filename,
                },
                template_filename,
                'GET',
              ).then(() => {
                message.success(`${template_filename}下载成功！`);
              });
            }}
          >
            模板下载
          </Button>
          <Select
            placeholder="请求选择平台"
            style={{ width: 180 }}
            onChange={set_data_source}
            options={data}
          />
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={file_list.length === 0}
            loading={uploading}
          >
            {uploading ? '上传中...' : '开始上传'}
          </Button>
        </Space>
      </Flex>
      <Flex>
        <Spin spinning={spinning}>
          <Upload
            multiple
            beforeUpload={(file) => {
              set_file_list([...file_list, file])
              return false
            }}
            fileList={file_list}
            onRemove={
              (file) => {
                const index = file_list.indexOf(file);
                const newFileList = file_list.slice();
                newFileList.splice(index, 1);
                set_file_list(newFileList);
              }
            }
          >
            <Button icon={<UploadOutlined />}>点击选择文件</Button>
          </Upload>
        </Spin>
      </Flex>
      <Divider />
      {isEmpty(execute_info) ? (
        <Empty
          style={{ marginTop: '100px' }}
          description={'暂无更新数据，请在右上角上传后查看！'}
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
                    去查看
                  </Button>
                }
              >
                <Statistic
                  title="现存数量"
                  value={execute_info?.goods_sales?.exists}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
                <Statistic
                  title="新增数量"
                  value={execute_info?.goods_sales?.inserted}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
                <Statistic
                  title="更新数量"
                  value={execute_info?.goods_sales?.updated}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
              </Card>
            </Col>
          )}
          {execute_info?.goods_commission && (
            <Col span={12}>
              <Card
                bordered={false}
                title="商品提成"
                extra={
                  <Button type="link" block onClick={() => jump('/goods/commission-management')}>
                    去查看
                  </Button>
                }
              >
                <Statistic
                  title="现存数量"
                  value={execute_info?.goods_commission?.exists}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
                <Statistic
                  title="新增数量"
                  value={execute_info?.goods_commission?.inserted}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
                <Statistic
                  title="更新数量"
                  value={execute_info?.goods_commission?.updated}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
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
                    去查看
                  </Button>
                }
              >
                <Statistic
                  title="现存数量"
                  value={execute_info?.account?.exists}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
                <Statistic
                  title="新增数量"
                  value={execute_info?.account?.inserted}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
                <Statistic
                  title="更新数量"
                  value={execute_info?.account?.updated}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
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
                    去查看
                  </Button>
                }
              >
                <Statistic
                  title="现存数量"
                  value={execute_info?.cooperator?.exists}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
                <Statistic
                  title="新增数量"
                  value={execute_info?.cooperator?.inserted}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
                <Statistic
                  title="更新数量"
                  value={execute_info?.cooperator?.updated}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  formatter={formatter}
                />
              </Card>
            </Col>
          )}
        </Row>
      )}
    </PageContainer>
  );
};

export default TableList;
