import { EditableProTable, ProColumns } from '@ant-design/pro-components';
import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';

export type UpdateTableDialogProps = {
  handleCancel: () => void;
  handleOk: () => Promise<void>;
  updateModalOpen: boolean;
  tableList: any[];
};

const demoList = [
  {
    shop_id: null,
    shop: '诺特兰德官方旗舰店',
    goods_name: '【贾乃亮代言】诺特兰德血橙复合B族9.9维生素b1b2b6VB咀嚼片正品',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3523123901012003782',
    id: 603,
    unique_id: '610a22e196e01e6eb9f0cd440f0a861e',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '仁和食品旗舰店',
    goods_name: '仁和维生素B复合维生素B1片含8种维生素添加水飞蓟甜橙官方旗舰店',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3534476000165555831',
    id: 604,
    unique_id: 'a2637d29b804f426262c14ac5662c1dc',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '诺特兰德官方旗舰店',
    goods_name: '【王濛代言】诺特兰德复合活性益生菌粉400亿活菌9.9益生元冻干粉',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3511633368678805657',
    id: 605,
    unique_id: '4a039a4606459c825881eef6c207ea1d',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '仁和食品旗舰店',
    goods_name: '仁和菊花决明子金银花枸杞橘皮竹叶栀子枸杞菊花茶草本官方旗舰店',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3625176048481745157',
    id: 606,
    unique_id: 'f1248735a16cf37930920924966c65ad',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '内廷上用长红专卖店',
    goods_name: '北京同仁堂维生素C维生素E烟酰胺片运动营养食品咀嚼片烟酸片60片',
    online_commission_rate: 0.02,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3652499971586051326',
    id: 607,
    unique_id: 'a737322bd5c582582228d805c7550a2a',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '诺特兰德滋补养生旗舰店',
    goods_name: '【贾乃亮代言】诺特兰德血橙复合维生素B族咀嚼片9.9维生素b正品',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3515918885109034668',
    id: 608,
    unique_id: '14cebc831008c34eb754ec952741af3f',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '诺特兰德官方旗舰店',
    goods_name: '诺特兰德贾乃亮代言维生素B维生素C咀嚼片B族VC片套餐VB族b1b2vb',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3521870575792450346',
    id: 609,
    unique_id: '15bfe8c25f3aa9fb687b93241b77fa54',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '诺特兰德官方旗舰店',
    goods_name: '【贾乃亮代言】诺特兰德蓝莓叶黄素酯咀嚼片蓝莓粉黑枸杞成人儿童',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3509067991155407233',
    id: 610,
    unique_id: 'f53797cee101ce11a6e28c2fdd82866f',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '容茗轩食品旗舰店',
    goods_name: '北京同仁堂维c+维e+烟酰胺淡斑嫩白运动营养VC咀嚼片通用60片',
    online_commission_rate: 0.35,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3591059671676545872',
    id: 611,
    unique_id: '17d4060f33252915f8dfb13e411d8005',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '诺特兰德官方旗舰店',
    goods_name: '【贾乃亮代言】诺特兰德维生素C咀嚼片9.9vc片b1b2复合多维元素片',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3518348148626078847',
    id: 612,
    unique_id: 'dc9adbc10e1e31b5a287d4f72d413184',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '内廷上用浮光滋补专卖店',
    goods_name: '北京同仁堂B族维生素咀嚼片B2B6B12补多种营养叶酸烟酸成人白黑',
    online_commission_rate: 0.1,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3646669484485408432',
    id: 613,
    unique_id: '5c4a689e11ebb41cf901e320f94349ab',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '内廷上用千品购专卖店',
    goods_name: '【40袋】北京同仁堂菊花决明子枸杞茶桑叶护健康养生熬夜肝火滋补茶',
    online_commission_rate: 0.5,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3627764629691851692',
    id: 614,
    unique_id: '3c9512d6708341bed35b05e8a6571b06',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '美梦精选',
    goods_name: '尿素霜维E乳霜改善皮肤干燥脱皮护手霜保湿滋润不油腻防干裂补水',
    online_commission_rate: 0.36,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3555839676533355398',
    id: 615,
    unique_id: '61de30de2a104130b029d60958ef172c',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '欧伊俪家具旗舰店',
    goods_name: '【官方正品】多维牛磺酸复合维生素b族片b1b2维生素C咀嚼片VC旗舰店',
    online_commission_rate: 0.01,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3649868399590407444',
    id: 616,
    unique_id: 'd0207085afa9c8d355c41371cf7b0b9d',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '欧伊俪家具旗舰店',
    goods_name: '【官方正品】维生素C+维生素E烟酸咀嚼片复合维生素vc+ve男女旗舰店',
    online_commission_rate: 0.01,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3649131606767230979',
    id: 617,
    unique_id: 'c90baca7b8f133b18be2f9f694dbccdc',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '内廷上用同庆堂专卖店',
    goods_name: '北京同仁堂B族维生素咀嚼片成人学生白头发多掉头发多压力大补充',
    online_commission_rate: 0.3,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3643569061570415883',
    id: 618,
    unique_id: '9e0442433072f5ab3933726c101f5557',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '鹏晨严选',
    goods_name: '德国不锈钢削皮刀土豆削皮器刮皮刀水果瓜刨刀厨房家用多功能神器',
    online_commission_rate: 0.01,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3648597796237541179',
    id: 619,
    unique_id: '320361fdc3d3da69f7832703bff5e9a3',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '茵束旗舰店',
    goods_name: '茵束牙膏生物溶菌酶牙膏清新口气清洁牙齿通用100g*3支+牙刷',
    online_commission_rate: 0,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3603259818523113487',
    id: 620,
    unique_id: '97af8ae7297991c27a050494c3238aae',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '诺特兰德官方旗舰店',
    goods_name: '【宠粉专享】诺特兰德9.9复合益生菌粉400亿活菌群肠道胃旗舰店',
    online_commission_rate: 0.3,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3553537009224181692',
    id: 621,
    unique_id: '6a384f3f9bbf7d0173529078f58ce6be',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
  {
    shop_id: null,
    shop: '欧伊俪家具旗舰店',
    goods_name: '【北京同仁堂】菊花枸杞决明子茶男女士熬夜去降上肝火养生花茶包',
    online_commission_rate: 0.05,
    offline_commission_rate: 0,
    data_source: '抖老板',
    created_by_userid: 1,
    modified_by_userid: 1,
    goods_id: '3648412343811077003',
    id: 622,
    unique_id: '2217bcbcb6dcdf590570c5653fd4e56e',
    commission_rate: 0,
    commission_fixed: 0,
    execute_id: '6308d6c04079ef3a330cbd77986f73e6',
    created_timestamp: '2023-12-20T07:57:48.995266',
    modified_timestamp: '2023-12-20T07:57:48.995287',
  },
];

const UpdateTableDialog: React.FC<UpdateTableDialogProps> = (props) => {
  const { updateModalOpen, handleOk, handleCancel } = props;

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
  demoList.map((item) => item.id),
  );
  const [dataSource, setDataSource] = useState<API.GoodsListItem[]>(demoList);

  const [messageApi, contextHolder] = message.useMessage();

  const columns: ProColumns<API.GoodsListItem>[] = [
    {
      title: '店铺名称',
      dataIndex: 'shop',
      editable: false
    },
    {
      title: '商品标题',
      dataIndex: 'goods_name',
      editable: false
    },
    {
      title: '全佣比例(%)',
      dataIndex: 'commission_rate',
      width: 130,
      valueType: 'percent',
      fieldProps: { precision: 2, step: 0.1, max: 1, min: 0 },
    },
    {
      title: '线下佣金比例(%)',
      dataIndex: 'offline_commission_rate',
      valueType: 'text',
      width: 130,
      fieldProps: { precision: 2, step: 0.1, max: 1, min: 0 },
    },
    {
      title: '线上佣金比例(%)',
      dataIndex: 'online_commission_rate',
      valueType: 'text',
      width: 130,
      fieldProps: { precision: 2, step: 0.1, max: 1, min: 0 },
    },
    {
      title: '提示',
      dataIndex: 'decs',
      render: () => {
        return '未设置有效商品佣金';
      },
      editable: false
    },
  ];

  return (
    <Modal
      title="异常数据处理"
      open={updateModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={1000}
    >
      {contextHolder}
      <div style={{ maxHeight: '500px', overflow: 'auto' }}>
        <EditableProTable
          headerTitle="商品提成"
          columns={columns}
          rowKey="id"
          scroll={{
            x: 960,
          }}
          value={dataSource}
          onChange={setDataSource}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            record: () => ({
              id: Date.now(),
            }),
          }}
          toolBarRender={() => {
            return [
              <Button
                type="primary"
                key="save"
                onClick={() => {
                  // dataSource 就是当前数据，可以调用 api 将其保存
                  console.log(dataSource);
                  messageApi.open({
                    type: 'success',
                    content: '更新成功',
                  })
                  handleCancel();
                }}
              >
                保存数据
              </Button>,
            ];
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
              setDataSource(recordList);
            },
            onChange: setEditableRowKeys,
          }}
        />
      </div>
    </Modal>
  );
};

export default UpdateTableDialog;
