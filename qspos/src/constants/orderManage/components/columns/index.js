const OrderColumns = [{
    title: '商品条码',
    dataIndex: 'code',
  },{
    title: '商品名称',
    dataIndex: 'name',
  },{
    title: '规格',
    dataIndex: 'displayName',
  },{
    title: '销售数量',
    dataIndex: 'qty',
  },{
    title: '零售价（元/个）',
    dataIndex: 'price',
  },{
    title: '折扣',
    dataIndex: 'discount',
  },{
    title: '折后总价（元）',
    dataIndex: 'payPrice',
  }]
const RechargeColumns = [{
    title: '充值前余额',
    dataIndex: 'beforeAmount',
  },{
    title: '充值金额',
    dataIndex: 'amount',
  },{
    title: '充值后余额',
    dataIndex: 'afterAmount',
  }]

export default {OrderColumns,RechargeColumns};
