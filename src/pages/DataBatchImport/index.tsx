import { dataBatchImport, getDataImportHistory, refreshUploadHistoryRecord } from '@/services/ant-design-pro/dataBatchImport';
import { getTemplateOptions } from '@/services/ant-design-pro/goods';
import { getReportHistoryById } from '@/services/ant-design-pro/reportManagment';
import { download, downloadFile } from '@/utils/dowload';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { request, useRequest } from '@umijs/max';
import {
  Button,
  Divider,
  Flex,
  FloatButton,
  message,
  notification,
  Select,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tooltip,
  Tour,
  Upload,
} from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { TourProps } from 'antd/lib/tour/interface';
import { isEmpty } from 'lodash';
import React, { useMemo, useRef, useState } from 'react';
import helpPng from './help.png';

type MyArrayElement = {
  [key: string]: any;
  extra: Array<Record<string, any>>;
};

type ResultElement = Record<string, any>;

export function flattenArray(arr: MyArrayElement[], extraObj?: Record<'execute_id', string>): ResultElement[] {
  return arr.reduce<ResultElement[]>((result, item) => {
    let { extra = [{}], ..._ } = item;
    if (extra.length === 0) extra.push({});
    const _extra = extra.map((extraItem) => ({
      ..._,
      ...extraItem,
      ...extraObj
    }));
    return [...result, ..._extra];
  }, []);
}

export function checkErrorData(arr: MyArrayElement[]): boolean {
  return arr.some((_) => _?.extra?.length > 0);
}

const TableList: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const ref1 = useRef<HTMLButtonElement>(null);
  const ref2 = useRef<HTMLButtonElement>(null);
  const ref3 = useRef<HTMLButtonElement>(null);
  const ref4 = useRef<HTMLButtonElement>(null);
  const ref5 = useRef<HTMLButtonElement>(null);
  const actionRef = useRef<ActionType>();

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
        '上传成功后下方卡片会更新不同模块的更新数据，异常未关联数据可点击下载模版修改后重新上传更新。详细信息可参考上图标注。',
      target: () => ref4.current!,
      cover: <img alt="tour.png" src={helpPng} />,
    },
    {
      title: '提示：模版下载',
      description: '如果想主动更新模版可以先在左上角选择模版平台，然后点击右下角按钮下载！',
      target: () => ref5.current!,
    },
  ];

  const renderCell = (dataSource: string | any[]) => {
    return (text, row, index) => {
      const obj = {
        children: text,
        props: {},
      };
      // 只比较第一列（name）的数据
      if (index < dataSource.length - 1 && dataSource[index].name === dataSource[index + 1].name) {
        obj.props.rowSpan = 2;
      } else if (index > 0 && dataSource[index].name === dataSource[index - 1].name) {
        obj.props.rowSpan = 0;
      }
      return obj;
    };
  };

  const [spinning, setSpinning] = React.useState<boolean>(false);
  const [execute_info, setexecute_info] = React.useState<any[]>([]);

  const { data } = useRequest(() => getTemplateOptions());
  const [data_source, set_data_source] = useState('');

  const [file_list, set_file_list] = useState([]);
  const [uploading, setUploading] = useState(false);

  useRequest(dataBatchImport, {
    manual: true,
  });

  // 请求刷新上传历史记录接口
  const { run: runRefreshUploadHistoryRecord, cancel: cancelRefreshUploadHistoryRecord } = useRequest(refreshUploadHistoryRecord, {
    manual: true,
    pollingInterval: 1500
  });

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

          // let summary = {};

          // success.forEach((item) => {
          //   let execute_info = item.records.execute_info;
          //   for (let key in execute_info) {
          //     if (!summary[key]) {
          //       summary[key] = { ...execute_info[key] };
          //     } else {
          //       summary[key].inserted += execute_info[key].inserted;
          //       summary[key].updated += execute_info[key].updated;
          //       summary[key].exists += execute_info[key].exists;
          //     }
          //   }
          // });
          // console.log('summary', summary)
          const execute_info = success.map(_ => ({..._, ..._.records}))
          setexecute_info(execute_info);
          set_file_list([]);

          // 每次重新上传后先停止之前的轮询，再重新开始请求
          cancelRefreshUploadHistoryRecord()
          runRefreshUploadHistoryRecord(execute_info.map(item => item?.execute_id))
        } else {
          notification.open({
            message: '错误提示',
            duration: 120,
            description: (
              <div
                dangerouslySetInnerHTML={{
                  __html: message?.replace(/\\n|\n/g, '<br>'),
                }}
              ></div>
            ),
            key: 'error',
            onClose: async () => null,
            icon: <ExclamationCircleOutlined color="red" />,
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

  const downloadTemp = async () => {
    const template_filename = data.find((_) => _.value === data_source)?.template_filename;
    console.log(template_filename);
    if (!template_filename) {
      return message.warning('在左上角选择模版的平台吧');
    }
    download(
      '/api/v1/tools/download/templates',
      {
        template_filename,
      },
      template_filename,
      'get',
    );
  };

  const handleDowloadReport = async (execute_id: string) => {
    // 先获取上传详情
    const res = await getDataImportHistory(execute_id);
    const { report_execute_id } = res;
    if (!report_execute_id)
      return message.warning('当前报告还未生成，可以稍后在导入历史记录中查看!');
    const _res = await getReportHistoryById(report_execute_id);
    const { execute_info } = _res;
    const { data_info = [] } = JSON.parse(execute_info) || {};
    downloadFile(data_info[0].download || '');
  };

  const columns: ProColumns<API.ShopListItem>[] = [
    {
      title: '上传文件名',
      dataIndex: 'filename',
      render(text, record) {
        const _ = JSON.parse(record.execute_info);
        return <Tooltip color="#ff4d4f" title={checkErrorData(_.execute_info) ? '有数据需要维护' : ''}>
          <span
            style={{ color: checkErrorData(_.execute_info) ? '#ff4d4f' : '#52c41a' }}
          >
            {text}
          </span>
        </Tooltip>
      }
    },
    {
      title: '上传平台',
      dataIndex: 'data_source',
    },
    {
      title: '生成报告',
      dataIndex: 'report_execute_id',
      render(text, record) {
        if (!record.report_execute_id) return '-';
        return <Button onClick={() => handleDowloadReport(record.report_execute_id)}>下载报告</Button>
      },
    }
  ];

  const genInfoColumns = (
    dataSource: Record<string, any>[],
  ): TableColumnsType<Record<string, any>> => [
    {
      dataIndex: 'cn_name',
      title: '模块名称',
      render: renderCell(dataSource),
    },
    {
      dataIndex: 'exists',
      title: '存量数',
      render: renderCell(dataSource),
    },
    {
      dataIndex: 'inserted',
      title: '新增数',
      render: renderCell(dataSource),
    },
    {
      dataIndex: 'update',
      title: '更新数',
      render: renderCell(dataSource),
    },
    {
      title: '数据来源',
      dataIndex: 'data_source',
    },
    {
      title: '需维护数',
      dataIndex: 'maintainable',
    },
    {
      title: '操作',
      dataIndex: 'template_file',
      render(text, record) {
        if (record.maintainable <= 0 || !record.maintainable) return '';
        return (
          <Space>
            <a type="text" onClick={() => downloadFile(text)}>
              下载修改
            </a>
            <Upload
              showUploadList={false}
              multiple
              beforeUpload={(file, fileList = []) => {
                const formData = new FormData();
                if (isEmpty(fileList)) return false;
                fileList.forEach((file) => {
                  formData.append('file_list', file as RcFile);
                });

                request('/api/v1/tools/upload/excel_list', {
                  method: 'POST',
                  data: formData,
                  params: {
                    data_source: record.data_source,
                    execute_id: record.execute_id
                  },
                })
                  .then((res = {}) => {
                    const { success, message, failure = [] } = res;
                    if (!isEmpty(success) && Array.isArray(success)) {
                      notification.open({
                        message: '更新成功',
                        key: 'error',
                        onClose: async () => null,
                        icon: <CheckCircleOutlined />,
                        placement: 'top',
                      });
                    } else {
                      notification.open({
                        message: '错误提示',
                        duration: 120,
                        description: (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: message?.replace(/\\n|\n/g, '<br>'),
                            }}
                          ></div>
                        ),
                        key: 'error',
                        onClose: async () => null,
                        icon: <ExclamationCircleOutlined color="red" />,
                        placement: 'top',
                      });
                    }
                    // message.success('upload successfully.');
                  })
                  .catch(() => {
                    message.error('upload failed.');
                  });
                return false;
              }}
            >
              <a type="text">更新上传</a>
            </Upload>
          </Space>
        );
      },
    },
  ];

  // 响应上传后返回的execute_info的execute_id集合
  const execute_id_check = useMemo(() => {
    // return execute_info?.map(_ => _?.record?.execute_id})
    return execute_info?.map(item => item?.execute_id)
  }, [execute_info])

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
            disabled={file_list.length === 0 || !data_source}
            loading={uploading}
            ref={ref3}
          >
            {uploading ? '上传中...' : '开始上传'}
          </Button>
          <Button style={{ marginLeft: 'auto' }} type="primary" onClick={() => setOpen(true)}>
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
      <div ref={ref4}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {!isEmpty(execute_info) && <ProTable
            headerTitle="更新数据"
            rowKey="execute_id"
            options={{
              reload() {
                console.log('reload')

              }
            }}
            // request={getDataImportHistoryList}
            dataSource={execute_info || []}
            columns={columns}
            search={false}
            actionRef={actionRef}
            expandable={{
              expandedRowRender: (record) => {
                const _ = JSON.parse(record.execute_info);
                return (
                  <Table
                    key="data_source"
                    columns={genInfoColumns(flattenArray(_.execute_info) || [])}
                    dataSource={flattenArray(_.execute_info, { execute_id: _.execute_id }) || []}
                    size="small"
                  />
                );
              },
            }}
          />}
          {/* {execute_info.map((_) => (
            <Collapse
              key={_.filename}
              collapsible="header"
              expandIconPosition="end"
              items={[
                {
                  key: _.filename,
                  label: (
                    <Tooltip color="#ff4d4f" title={checkErrorData(_.records.execute_info) ? '有数据需要维护' : ''}>
                      <span
                        style={{ color: checkErrorData(_.records.execute_info) ? '#ff4d4f' : '#52c41a' }}
                      >
                        {_.filename}
                      </span>
                    </Tooltip>
                  ),
                  extra: genExtra(_.records.execute_id),
                  children: (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Table
                        columns={genInfoColumns(flattenArray(_.records.execute_info) || [])}
                        dataSource={flattenArray(_.records.execute_info) || []}
                        size="small"
                      />
                    </Space>
                  ),
                },
              ]}
            />
          ))} */}
        </Space>
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
    </PageContainer>
  );
};

export default TableList;
