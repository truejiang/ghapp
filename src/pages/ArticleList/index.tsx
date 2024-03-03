import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProDescriptions,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, Form, message, Popconfirm } from 'antd';
import React, { useRef, useState } from 'react';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { addArticle, removeArticle, updateArticle, getArticles, getArticle } from '@/services/ant-design-pro/articles';


import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.ArticleListItem) => {

  const hide = message.loading('正在添加');
  console.log(fields)
  try {
    await addArticle({ ...fields, user_id: 0, tags: fields.tags });
    hide();
    message.success('添加成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Adding failed, please try again!');
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Configuring');
  try {
    await updateArticle({
      article_id: fields.article_id,
      user_id: 0,
      article_title: fields.article_title,
      article_text: fields.article_text,
      tags: fields.tags,
    });
    hide();

    message.success('编辑成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param article_id
 */
const handleRemove = async (article_id: number) => {
  const hide = message.loading('正在删除');
  if (!article_id) return true;
  console.log('article_id', article_id)
  try {
    await removeArticle(article_id);
    hide();
    message.success('删除成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Delete failed, please try again');
    return false;
  }
};

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  /** */
  const [articleText, setArticleText] = useState<string>('');


  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.ArticleListItem>();

  const restFormRef = useRef(null)

  const columns: ProColumns<API.ArticleListItem>[] = [
    {
      title: "标题",
      dataIndex: 'article_title',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: "内容",
      dataIndex: 'article_text',
      valueType: 'text',
      render: (dom, entity) => {
        return <div dangerouslySetInnerHTML={{__html: entity.article_text}} />
      }
    },
    {
      title: "标签",
      dataIndex: 'tags',
      valueType: 'text',
    },
    {
      title: "操作",
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="删除文章"
          description="删除后不可恢复，确认删除?"
          onConfirm={async () => {
            const success = record.article_id && await handleRemove(record.article_id)
            if (success) {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          okText="确认"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.ArticleListItem, API.PageParams>
        headerTitle={'文章管理'}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新增
          </Button>,
        ]}
        request={getArticles}
        columns={columns}
      />
      <ModalForm
        title={'新增'}
        width="800px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        formRef={restFormRef}
        onFinish={async (value) => {
          if(!articleText) return message.error('文章内容未输入')
          value.article_text = articleText
          const success = await handleAdd(value as API.ArticleListItem);
          if (success) {
            if (restFormRef.current) {
              restFormRef.current.resetFields()
            }
            handleModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
          return true
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
        <Form.Item
          required
          label="内容"
          name="article_text">
            <ReactQuill theme="snow" value={articleText} onChange={setArticleText} />
        </Form.Item>
        <ProFormText
          rules={[
            {
              required: true,
              message: "标签必须输入",
            },
          ]}
          width="md"
          name="tags"
          label="标签"
        />
      </ModalForm>
      {updateModalOpen && <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate({ ...currentRow, ...value });
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}

        values={currentRow || {}}
      />}

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.article_title && (
          <ProDescriptions<API.ArticleListItem>
            column={2}
            title={currentRow?.article_title}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.article_title,
            }}
            columns={columns as ProDescriptionsItemProps<API.ArticleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
