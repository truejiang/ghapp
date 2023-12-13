import { getAccounts } from '@/services/ant-design-pro/accounts';
import { getCooperators } from '@/services/ant-design-pro/cooperator';
import {
  ModalForm,
  ProFormDigit,
  ProFormMoney,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & API.FinancesListItem;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.FinancesListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.cooperatorList.createForm.cooperatorList',
        defaultMessage: '编辑',
      })}
      width="400px"
      open={props.updateModalOpen}
      onFinish={props.onSubmit}
      initialValues={props.values}
      modalProps={{
        onCancel: () => {
          props.onCancel();
        },
      }}
    >
      <ProFormSelect
        name="cooperator_id"
        label="联创信息"
        request={async () => {
          const res = await getCooperators({});

          return (
            res.data?.map((_) => ({
              label: _.name,
              value: _.id,
            })) || []
          );
        }}
        placeholder="请选择一个联创信息"
        rules={[{ required: true, message: '请选择联创信息' }]}
      />
      <ProFormSelect
        name="account_id"
        label="账号"
        request={async () => {
          const res = await getAccounts({});

          return (
            res.data?.map((_) => ({
              label: _.account_name,
              value: _.account_id,
            })) || []
          );
        }}
        placeholder="请选择联一个账号"
        rules={[{ required: true, message: '请选择联一个账号' }]}
      />
      <ProFormDigit
        label="分红比例"
        name="split_rate"
        min={0}
        max={1}
        required
        fieldProps={{ precision: 2, step: 0.1 }}
      />
      <ProFormDigit
        label="固定分红"
        name="fixed_charges"
        min={0}
        fieldProps={{ precision: 2, step: 0.1 }}
      />

      <ProFormTextArea name="remarks" label="备注" placeholder="请输入备注" />
    </ModalForm>
  );
};

export default UpdateForm;
