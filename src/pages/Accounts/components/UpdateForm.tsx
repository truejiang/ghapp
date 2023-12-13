import {
  ModalForm,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & API.AccountsListItem;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.AccountsListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.accounts.createForm.accounts',
        defaultMessage: '编辑',
      })}
      width="400px"
      open={props.updateModalOpen}
      onFinish={props.onSubmit}
      initialValues={props.values}
      modalProps={{
        onCancel: () => {
          props.onCancel()
        }
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.accounts.account_id"
                defaultMessage="账号ID必须输入"
              />
            ),
          },
        ]}
        width="md"
        name="account_id"
        label="账号ID"
        disabled
      />
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.accounts.account_name"
                defaultMessage="账户名称必须输入"
              />
            ),
          },
        ]}
        width="md"
        name="account_name"
        label="账户名称"
      />
      <ProFormText
        width="md"
        name="platform"
        label="平台"
      />
    </ModalForm>
  );
};

export default UpdateForm;
