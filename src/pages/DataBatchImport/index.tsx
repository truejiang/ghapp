import { getTemplateOptions } from '@/services/ant-design-pro/goods';
import { download } from '@/utils/dowload';
import { getToken } from '@/utils/indexs';
import { FileExcelOutlined, UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {  history, useRequest } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  message,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Upload,
  Empty
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

  const formatter = (value: number) => <CountUp end={value} separator="," />;

  const jump = (path: string) => {
    history.push(path);
  };

  return (
    <PageContainer>
      <Flex justify="flex-end" align="center" style={{ marginBottom: '12px' }}>
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
          {/* <span>是否从销售数据中创建其他相关数据</span> */}
          {/* <Select
            style={{ width: 240 }}
            placeholder="是否从销售数据中创建其他相关数据"
            onChange={set_create_related_data}
            options={[
              { value: true, label: '是' },
              { value: false, label: '否' },
            ]}
          /> */}
          <Spin spinning={spinning}>
            <Upload
              maxCount={1}
              action={`/api/v1/tools/upload/goods_sales_excel?data_source=${data_source}&create_related_data=${create_related_data}`}
              headers={{
                Authorization: getToken() || '',
              }}
              showUploadList={false}
              beforeUpload={() => {
                setSpinning(true);
                if (!data_source) {
                  setSpinning(false);
                  message.warning('请选择上传平台');
                  return false;
                }
              }}
              onChange={(info) => {
                const { file } = info;
                if (file.status === 'done') {
                  console.log(info);
                  setSpinning(false);

                  const { response = {} } = file;
                  const { records = {} } = response;
                  const { execute_info } = records;
                  notification.success({
                    message: '更新成功',
                  });
                  setexecute_info(execute_info);
                  // message.success('上传成功！正在更新表格数据');
                } else if (file.status === 'error') {
                  setSpinning(false);
                  notification.error({
                    message: '上传失败，请重试',
                  });
                }
              }}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Spin>
        </Space>
      </Flex>
      <Divider />
      {isEmpty(execute_info) ? (
        <Empty style={{marginTop: '100px'}} description={'暂无更新数据，请在右上角上传后查看！'}></Empty>
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
