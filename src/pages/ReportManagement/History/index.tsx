import {
  ActionType,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Descriptions, Drawer, Popconfirm,  Table,  message } from 'antd';
import { useRef, useState } from 'react';
import { getReportHistoryList, updateReportHistory } from '@/services/ant-design-pro/reportManagment';
import { downloadFile } from '@/utils/dowload';

type InputData = {
  [key: string]: string | string[];
};

type OutputData = {
  key: string;
  label: string;
  children: string;
};

const map = {
  data_source: '平台来源',
  order_status_check: '订单状态',
  date_range: '时间范围',
  report_name: '报告名称'
}
function transformData(data: InputData): OutputData[] {
  const { report_name, data_source, order_status_check, start_date, end_date } = data
  const _ = { report_name, data_source, order_status_check, date_range: `${start_date} - ${end_date}` }
  return Object.keys(_).map((key, index) => {
    let value = _[key];
    if (Array.isArray(value)) {
      value = value.length > 0 ? value.join(', ') : '-';
    }
    return {
      key,
      label: map[key as'data_source' | 'order_status_check' | 'date_range' | 'report_name'] || key,
      children: value
    };
  });
}


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
    await updateReportHistory(execute_id);
    hide();
    message.success('撤销成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const HistoryReport: React.FC = () => {

  const [currentRow, setCurrentRow] = useState<API.ShopListItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();


  const columns: ProColumns<API.ShopListItem>[] = [
    {
      title: '报告名称',
      dataIndex: 'archived_filename',
      render(text, record) {
        return <a>{text}</a>
      }
    },
    {
      title: '报告类型',
      dataIndex: 'report_name'
    },
    {
      title: '生成时间',
      dataIndex: 'created_timestamp',
      valueType: 'dateTime'
    },
    {
      title: '是否下载',
      dataIndex: 'is_download',
      valueType: 'select',
      request: async () => {
        return [{label: '是', value: "True"}, {label: '否', value: 
        "False"}]
      }
    },
    {
      title: '操作',
      valueType: 'option',
      render(_, record) {
        let url: any
        try {
          const { execute_info } = record
          const _execute_info = JSON.parse(execute_info) || {}
          const { data_info = [] } = _execute_info
          url = data_info[0]?.download
        } catch (error) {
          
        }
        return <a onClick={() => downloadFile(url || '')}>下载</a>
      }
    }
    
  ];


  return (
    <PageContainer>
      <ProTable
        headerTitle="下载记录"
        rowKey="execute_id"
        request={getReportHistoryList}
        columns={columns}
        search={false}
        actionRef={actionRef}
        expandable={{
          expandedRowRender: (record) => {
            const report_filter = JSON.parse(record.report_filter)

            return <Descriptions title="报告参数" items={transformData(report_filter)}/>
          }
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

export default HistoryReport;
