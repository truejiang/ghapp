import {
  getDataImportHistoryList,
  updateDataImportHistory,
} from '@/services/ant-design-pro/dataBatchImport';
import { downloadFile } from '@/utils/dowload';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { request } from '@umijs/max';
import {
  Button,
  Drawer,
  message,
  notification,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  Tooltip,
  Upload,
} from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import { checkErrorData, flattenArray } from '..';
import { getReportHistoryById } from '@/services/ant-design-pro/reportManagment';

/**
 *  Delete node
 * @zh-CN 撤销记录
 *
 * @param user_id
 */
const handleRemove = async (execute_id: string) => {
  const hide = message.loading('正在撤销');
  if (!execute_id) return true;
  try {
    await updateDataImportHistory(execute_id);
    hide();
    message.success('撤销成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const HistoryUpload: React.FC = () => {
  const [currentRow, setCurrentRow] = useState<API.ShopListItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const columns: ProColumns<API.ShopListItem>[] = [
    {
      title: '上传文件名',
      dataIndex: 'filename',
      render(text, record) {
        // return '-'
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
      title: '上传时间',
      dataIndex: 'created_timestamp',
      valueType: 'dateTime',
    },
    {
      title: '是否撤销',
      dataIndex: 'is_repeal',
      valueType: 'select',
      request: async () => {
        return [
          { label: '是', value: true },
          { label: '否', value: false },
        ];
      },
    },
    {
      title: '生成报告',
      dataIndex: 'report_execute_id',
      render(text, record) {
        if (!record.report_execute_id) return '-';
        return <Button onClick={() => handleDowloadReport(record.report_execute_id)}>下载报告</Button>
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render(_, record) {
        return (
          <Popconfirm
            title="撤销"
            description="撤销后不可恢复，确认撤销?"
            onConfirm={async () => {
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              record.execute_id && (await handleRemove(record.execute_id));
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
            okText="确认"
            cancelText="取消"
          >
            <a>撤销</a>
          </Popconfirm>
        );
      },
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
        if(record.maintainable <= 0 || !record.maintainable) return ''
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

                      if (actionRef.current) {
                        actionRef.current.reload();
                      }
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

  const handleDowloadReport = async (report_execute_id: string) => {
    const res = await getReportHistoryById(report_execute_id)
    const { execute_info } = res
    const {data_info = []} = JSON.parse(execute_info) || {}
    downloadFile(data_info[0].download || '')
  }

  return (
    <PageContainer>
      <ProTable
        headerTitle="上传历史"
        rowKey="execute_id"
        request={getDataImportHistoryList}
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
        {currentRow?.excute_id && (
          <ProDescriptions<API.ShopListItem>
            column={2}
            title={currentRow?.excute_id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.excute_id,
            }}
            columns={columns as ProDescriptionsItemProps<API.ShopListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default HistoryUpload;
