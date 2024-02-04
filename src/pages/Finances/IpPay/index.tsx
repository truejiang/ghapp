import { getIpPay } from "@/services/ant-design-pro/finances";
import { PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";

const IpPay: React.FC = () => {
  const columns: ProColumns<API.IpPayListItem>[] = [
    {
      title: "IP",
      dataIndex: 'ip_name',
    },
    {
      title: '账号名',
      dataIndex: "account_name"
    },
    {
      title: '账号ID',
      dataIndex: "account_id"
    },
    {
      title: '应付IP费用比例(%)',
      dataIndex: "pay_rate",
      render(text) {
        return text * 100
      }
    }
  ]
  return <PageContainer>
    <ProTable
      headerTitle="IP费用"
      rowKey="key"
      request={getIpPay}
      columns={columns}
      search={false}
      />
  </PageContainer>
}

export default IpPay;