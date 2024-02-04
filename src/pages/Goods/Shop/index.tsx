import { addGoodShop, getGoodShopList, updateGoodsShop } from '@/services/ant-design-pro/goods';
import { PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Drawer, message } from 'antd';
import { useRef, useState } from 'react';
import UpdateForm from './UpdateForm';

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.CreateShopItem) => {
  const hide = message.loading('正在添加');
  try {
    await addGoodShop({ ...fields });
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
const handleUpdate = async (fields: API.UpdateShopListItem) => {
  const hide = message.loading('Configuring');
  try {
    await updateGoodsShop(fields);
    hide();
    message.success('编辑成功！');
    return true;
  } catch (error) {
    hide();
    message.error('Configuration failed, please try again!');
    return false;
  }
};


const Shop: React.FC = () => {
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);

  const [currentRow, setCurrentRow] = useState<API.ShopListItem>();
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const restFormRef = useRef(null)
  const actionRef = useRef<ActionType>();


  const columns: ProColumns<API.ShopListItem>[] = [
    {
      title: '商铺名称',
      dataIndex: 'shop',
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
      title: '是否供应链',
      dataIndex: 'is_supplier',
      render: (text) => (!!text ? '是' : '否'),
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (_, record) => [
        <a key="config" onClick={() => {
          setCurrentRow(record)
          handleUpdateModalOpen(true)
        }}>
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="供应链"
        rowKey="shop_id"
        request={getGoodShopList}
        columns={columns}
        search={false}
        actionRef={actionRef}
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
      />
      <ModalForm
        title="新增"
        width="400px"
        open={createModalOpen}
        onOpenChange={handleModalOpen}
        formRef={restFormRef}
        onFinish={async (value) => {
          console.log("🚀 ~ onFinish={ ~ value:", value)
          
          // const { commission_rate, online_commission_rate, offline_commission_rate } = value;
          // if (
          //   ((!!commission_rate && !!online_commission_rate) || !!offline_commission_rate) &&
          //   commission_rate !== online_commission_rate + offline_commission_rate
          // ) {
          //   return message.warning('全佣比例应该等于线上和线下佣金比例之和');
          // }
          const success = await handleAdd(value as API.GoodsListItem);
          if (success) {
            if (restFormRef.current) {
              restFormRef.current?.resetFields();
              actionRef.current.reload();
            }
            handleModalOpen(false);

          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: "店铺名称必须输入",
            },
          ]}
          width="md"
          name="shop"
          label="店铺名称"
        />
        <ProFormText
          width="md"
          name="shop_id"
          label="店铺ID"
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
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.shop && (
          <ProDescriptions<API.ShopListItem>
            column={2}
            title={currentRow?.shop}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.shop,
            }}
            columns={columns as ProDescriptionsItemProps<API.ShopListItem>[]}
          />
        )}
      </Drawer>

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
    </PageContainer>
  );
};

export default Shop;
