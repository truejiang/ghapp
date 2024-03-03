import { getAccounts } from '@/services/ant-design-pro/accounts';
import { getCooperators } from '@/services/ant-design-pro/cooperator';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useIntl, useRequest } from '@umijs/max';
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

const filterOption = (input: string, option?: { label: string; value: string }) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();

  const { data: cooperatorList } = useRequest(() => getCooperators({ current: 1, pageSize: 9999 }));
  const { data: accountList } = useRequest(() => getAccounts({ current: 1, pageSize: 9999 }));

  return (
    <ModalForm
      title={'编辑'}
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
        
        fieldProps={{
          showSearch:  true,
          filterOption: (inputValue, option) => {
            return (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase()) || (option?.value ?? '')?.toString().includes(inputValue.toLowerCase())
          }
        }}

        options={cooperatorList?.map(_ => ({
          label: _.name,
          value: _.id
        }))}
        
        placeholder="请选择一个联创信息"
        rules={[{ required: true, message: '请选择联创信息' }]}
      />
      <ProFormSelect
        name="account_id"
        label="账号"
        fieldProps={{
          showSearch:  true,
          filterOption: (inputValue, option) => {
            return (option?.label ?? '').toLowerCase().includes(inputValue.toLowerCase()) || (option?.value ?? '')?.toString().includes(inputValue.toLowerCase())
          }
        }}
        options={accountList?.map(_ => ({
          label: _.account_name,
          value: _.account_id
        }))}
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
