import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import { addCooperator, removeCooperator, updateCooperator, getCooperators } from '@/services/ant-design-pro/cooperator';
import { download, downloadFile } from '@/utils/dowload';

const requestData = () => {
  return Promise.resolve([
    { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
    { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
    { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
    { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
    { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
  ])
}

const TableList: React.FC = () => {

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.CooperatorListItem>();

  const columns: ProColumns<API.CooperatorListItem>[] = [
    {
      title: '操作时间',
      dataIndex: 'updatetime',
      valueType: 'date',
    },
    {
      title: '操作类型',
      dataIndex: 'operateType',
      valueType: 'text',
    },
    {
      title: '原始数据',
      dataIndex: 'originalData',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            downloadFile("http://101.32.35.38:8088/api/v1/tools/download/files/1703422542-账号分账配置维护.xlsx")
          }}
        >
          {record.originName}
        </a>,
      ],
    },
    {
      title: '更新后数据',
      dataIndex: 'updatedData',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            downloadFile("http://101.32.35.38:8088/api/v1/tools/download/files/1703422542-账号分账配置维护.xlsx")
          }}
        >
          {record.updatedData}
        </a>,
      ],
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.CooperatorListItem, API.PageParams>
        headerTitle={"历史记录"}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 140,
          defaultCollapsed: false,
showHiddenNum: true
        }}
        dataSource={[
          { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
          { updatetime: '2023-12-25', operateType: '抖老板异常处理', 'originName': '抖老板异常数据.excel', updatedData: '抖老板异常数据(更新后).excel' },
          { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
          { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
          { updatetime: '2023-12-25', operateType: '抖老板', 'originName': '2023-12-25抖老板.excel', updatedData: '2023-12-25抖老板(更新后).excel' },
        ]}
        columns={columns}
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
        {currentRow?.name && (
          <ProDescriptions<API.CooperatorListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.CooperatorListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
