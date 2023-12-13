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
} & API.CooperatorListItem;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.CooperatorListItem>;
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
                id="pages.cooperatorList.name"
                defaultMessage="联创公司必须输入"
              />
            ),
          },
        ]}
        width="md"
        name="name"
        label="联创公司"
      />
      <ProFormText
        width="md"
        name="founder"
        label="创始人"
      />
    </ModalForm>
  );
};

export default UpdateForm;
