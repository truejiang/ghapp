import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.ArticleListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.ArticleListItem>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const [articleText, setArticleText] = useState<string>(props.values.article_text || '');
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setIsInitialRender(false)
  }, [props.values.article_text]);

  const intl = useIntl();
  return (
    <ModalForm
      title={intl.formatMessage({
        id: 'pages.articleList.createForm.articleList',
        defaultMessage: '编辑',
      })}
      width="800px"
      open={props.updateModalOpen}
      onFinish={async (value) => {
        if (!articleText) return message.error('文章内容未输入');
        value.article_text = articleText;
        return props.onSubmit(value);
      }}
      initialValues={props.values}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          setArticleText('');
          setIsInitialRender(true)
          props.onCancel();
        },
      }}
    >
      <ProFormText
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.articleList.article_title"
                defaultMessage="标题必须输入"
              />
            ),
          },
        ]}
        width="md"
        name="article_title"
        label="标题"
      />
      <Form.Item required label="内容" name="article_text">
        {!isInitialRender && (
          <ReactQuill
            theme="snow"
            value={articleText}
            onChange={(v) => {
              setArticleText(v);
            }}
          />
        )}
      </Form.Item>
      <ProFormText
        rules={[
          {
            required: true,
            message: <FormattedMessage id="pages.articleList.tags" defaultMessage="标签必须输入" />,
          },
        ]}
        width="md"
        name="tags"
        label="标签"
      />
    </ModalForm>
  );
};

export default UpdateForm;
