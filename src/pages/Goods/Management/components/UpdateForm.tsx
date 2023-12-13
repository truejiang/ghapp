import { ModalForm, ProFormDigit, ProFormMoney, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & API.GoodsListItem;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.GoodsListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.goods.createForm.goods',
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
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage id="pages.goods.goods_name" defaultMessage="商品名称必须输入" />
            ),
          },
        ]}
        width="md"
        name="goods_name"
        label="商品名称"
      />
      <ProFormDigit
        label="提成比例"
        name="commission_rate"
        min={0}
        max={1}
        fieldProps={{ precision: 2, step: 0.1 }}
      />
      <ProFormText width="md" name="commission_fixed" label="固定佣金" />
      <ProFormMoney min={0} width="md" name="price" label="价格" />
    </ModalForm>
  );
};

export default UpdateForm;
