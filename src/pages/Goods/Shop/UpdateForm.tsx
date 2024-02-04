import { ModalForm, ProFormDigit, ProFormMoney, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & API.ShopListItem;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.ShopListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      title='编辑'
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
      <ProFormText
        rules={[
          {
            required: true,
            message: <FormattedMessage id="pages.goods.shop" defaultMessage="商铺名称必须输入" />,
          },
        ]}
        width="md"
        name="shop"
        label="商铺名称"
      />
      <ProFormRadio.Group
          width="md"
          name="is_supplier"
          label="是否供应链"
          options={[
            {
              label: '是',
              value: true,
            },
            {
              label: '否',
              value: false,
            }
          ]}
        />
    </ModalForm>
  );
};

export default UpdateForm;
