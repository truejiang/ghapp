import { ModalForm, ProFormSwitch, ProFormText } from '@ant-design/pro-components';
import React from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.UserListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.UserListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props: React.PropsWithChildren<UpdateFormProps>) => {
  return (
    <ModalForm
      title={'编辑'}
      width="400px"
      open={props.updateModalOpen}
      onFinish={props.onSubmit}
      trigger={<>{props.children}</>}
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
            message: "账号必须输入",
          },
        ]}
        width="md"
        name="username"
        label="账号"
      />
      <ProFormText
        rules={[
          {
            type: 'email',
            message: '请输入正确的邮箱格式!',
          },
          {
            required: true,
            message: "邮箱必须输入",
          },
        ]}
        width="md"
        name="email"
        label="邮箱"
      />
      <ProFormSwitch
          name="is_admin"
          label="是否管理员"
          fieldProps={{
            checkedChildren: '开启',
            unCheckedChildren: '关闭',
          }}
        />
        <ProFormSwitch
          name="is_active"
          label="是否激活"
          fieldProps={{
            checkedChildren: '开启',
            unCheckedChildren: '关闭'
          }}
        />
    </ModalForm>
  );
};

export default UpdateForm;
